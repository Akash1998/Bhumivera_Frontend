/**
 * BhumiVera Security & Authentication Engine (Enterprise Client Layer)
 * - Communicates with hardened Server API (/api/auth & /api/admin)
 * - HttpOnly Cookie Authentication
 * - FIDO2 / WebAuthn Biometric Passkeys verified by Server
 * - RFC 6238 TOTP 2FA verified by Server
 * - Role-Based Access Enforcement
 */

const BVAuth = (() => {
    let cachedSession = null;
    let tempAuthToken = null;

    // Helper for base64url encoding / decoding in WebAuthn
    function bufferToBase64URL(buffer) {
        const bytes = new Uint8Array(buffer);
        let str = '';
        for (const charCode of bytes) {
            str += String.fromCharCode(charCode);
        }
        return window.btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    function base64URLToBuffer(base64URL) {
        const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/');
        const padLen = (4 - (base64.length % 4)) % 4;
        const padded = base64.padEnd(base64.length + padLen, '=');
        const binary = window.atob(padded);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    const API_BASE = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
        ? 'https://service.bhumivera.com'
        : '';

    async function apiRequest(endpoint, options = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };
        const config = {
            ...options,
            credentials: 'include', // Ensures HttpOnly cookie is passed
            headers: {
                ...defaultHeaders,
                ...(options.headers || {})
            }
        };

        const targetUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

        try {
            const res = await fetch(targetUrl, config);
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                return { success: false, status: res.status, error: data.error || 'Server request failed' };
            }
            return { success: true, ...data };
        } catch (err) {
            console.error(`API Error on ${endpoint}:`, err);
            return { success: false, error: 'Network error or server unavailable.' };
        }
    }

    return {
        // Fetch current authenticated session from server
        async checkSession() {
            const res = await apiRequest('/api/auth/me');
            if (res.success && res.user) {
                cachedSession = res.user;
                sessionStorage.setItem('BV_ACTIVE_SESSION', JSON.stringify(cachedSession));
                return cachedSession;
            }
            cachedSession = null;
            sessionStorage.removeItem('BV_ACTIVE_SESSION');
            return null;
        },

        getCurrentSession() {
            if (cachedSession) return cachedSession;
            const raw = sessionStorage.getItem('BV_ACTIVE_SESSION');
            return raw ? JSON.parse(raw) : null;
        },

        // Password verification & login
        async verifyCredentials(username, password) {
            const res = await apiRequest('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (!res.success) {
                return { success: false, message: res.error || 'Invalid Account ID or Password.' };
            }

            if (res.requires2FA) {
                tempAuthToken = res.tempToken;
                return {
                    success: true,
                    requires2FA: true,
                    username: res.username
                };
            }

            cachedSession = res.user;
            sessionStorage.setItem('BV_ACTIVE_SESSION', JSON.stringify(res.user));
            return {
                success: true,
                requires2FA: false,
                session: res.user,
                firstLogin: res.user.firstLogin
            };
        },

        // Complete 2FA Login
        async complete2FALogin(username, code) {
            const res = await apiRequest('/api/auth/2fa/verify', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    code,
                    tempToken: tempAuthToken || 'session'
                })
            });

            if (!res.success) {
                return { success: false, message: res.error || 'Invalid 6-digit authentication code.' };
            }

            cachedSession = res.user;
            sessionStorage.setItem('BV_ACTIVE_SESSION', JSON.stringify(res.user));
            return {
                success: true,
                session: res.user,
                firstLogin: res.user.firstLogin
            };
        },

        // Passkey Login (FIDO2 WebAuthn Server-Verified)
        async loginWithPasskey(username) {
            if (!window.PublicKeyCredential) {
                throw new Error('WebAuthn biometrics not supported on this browser.');
            }

            // Step 1: Get challenge options from server
            const optRes = await apiRequest('/api/auth/passkey/auth-options', {
                method: 'POST',
                body: JSON.stringify({ username })
            });

            if (!optRes.success) {
                throw new Error(optRes.error || 'Failed to initialize biometric challenge.');
            }

            const options = optRes;
            // Decode binary buffers
            options.challenge = base64URLToBuffer(options.challenge);
            if (options.allowCredentials) {
                options.allowCredentials = options.allowCredentials.map(c => ({
                    ...c,
                    id: base64URLToBuffer(c.id)
                }));
            }

            // Step 2: Prompt device biometric authenticator
            let assertion;
            try {
                assertion = await navigator.credentials.get({ publicKey: options });
            } catch (err) {
                if (err.name === 'NotAllowedError') {
                    throw new Error('Biometric verification was cancelled.');
                }
                throw err;
            }

            // Step 3: Serialize assertion and verify on server
            const payload = {
                username,
                response: {
                    id: assertion.id,
                    rawId: bufferToBase64URL(assertion.rawId),
                    type: assertion.type,
                    response: {
                        authenticatorData: bufferToBase64URL(assertion.response.authenticatorData),
                        clientDataJSON: bufferToBase64URL(assertion.response.clientDataJSON),
                        signature: bufferToBase64URL(assertion.response.signature),
                        userHandle: assertion.response.userHandle ? bufferToBase64URL(assertion.response.userHandle) : null
                    }
                }
            };

            const verifyRes = await apiRequest('/api/auth/passkey/auth-verify', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!verifyRes.success) {
                throw new Error(verifyRes.error || 'Biometric signature rejected by server.');
            }

            cachedSession = verifyRes.user;
            sessionStorage.setItem('BV_ACTIVE_SESSION', JSON.stringify(verifyRes.user));
            return { success: true, session: verifyRes.user };
        },

        // Enroll New Passkey (Biometric Registration)
        async enrollPasskey(username, friendlyName = 'Primary Device') {
            if (!window.PublicKeyCredential) {
                throw new Error('WebAuthn biometrics not supported on this device/browser.');
            }

            // Step 1: Get registration options from server
            const optRes = await apiRequest('/api/auth/passkey/register-options', { method: 'POST' });
            if (!optRes.success) {
                throw new Error(optRes.error || 'Failed to start passkey registration.');
            }

            const options = optRes;
            options.challenge = base64URLToBuffer(options.challenge);
            options.user.id = base64URLToBuffer(options.user.id);
            if (options.excludeCredentials) {
                options.excludeCredentials = options.excludeCredentials.map(c => ({
                    ...c,
                    id: base64URLToBuffer(c.id)
                }));
            }

            // Step 2: Create credential on device
            let credential;
            try {
                credential = await navigator.credentials.create({ publicKey: options });
            } catch (err) {
                if (err.name === 'NotAllowedError') {
                    throw new Error('Passkey creation was cancelled.');
                }
                throw err;
            }

            // Step 3: Send public key to server for cryptographic verification
            const payload = {
                friendlyName,
                response: {
                    id: credential.id,
                    rawId: bufferToBase64URL(credential.rawId),
                    type: credential.type,
                    response: {
                        attestationObject: bufferToBase64URL(credential.response.attestationObject),
                        clientDataJSON: bufferToBase64URL(credential.response.clientDataJSON),
                        transports: credential.response.getTransports ? credential.response.getTransports() : []
                    }
                }
            };

            const verifyRes = await apiRequest('/api/auth/passkey/register-verify', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!verifyRes.success) {
                throw new Error(verifyRes.error || 'Failed to verify passkey registration.');
            }

            return { success: true, message: 'Passkey registered!' };
        },

        // Remove Passkey
        async removePasskey(username, passkeyId) {
            const res = await apiRequest(`/api/auth/passkeys/${passkeyId}`, { method: 'DELETE' });
            return res.success;
        },

        // Get Passkeys for Profile
        async getPasskeys() {
            const res = await apiRequest('/api/auth/passkeys');
            return res.success ? (res.passkeys || []) : [];
        },

        // 2FA Management
        async generate2FAData(username) {
            const res = await apiRequest('/api/auth/totp/setup', { method: 'POST' });
            if (!res.success) throw new Error(res.error || 'Failed to setup 2FA');
            return res;
        },

        async enable2FA(username, secret, verificationCode) {
            const res = await apiRequest('/api/auth/totp/enable', {
                method: 'POST',
                body: JSON.stringify({ code: verificationCode })
            });
            if (!res.success) {
                return { success: false, message: res.error || 'Invalid 6-digit code.' };
            }
            if (cachedSession) cachedSession.totpEnabled = true;
            return { success: true, message: 'Two-Factor Authentication is now active!' };
        },

        async disable2FA(username, password) {
            const pass = password || prompt('Enter your current password to disable 2FA:');
            if (!pass) return false;

            const res = await apiRequest('/api/auth/totp/disable', {
                method: 'POST',
                body: JSON.stringify({ password: pass })
            });

            if (res.success && cachedSession) cachedSession.totpEnabled = false;
            return res.success;
        },

        // Complete First Login
        async completeFirstLogin(username) {
            await apiRequest('/api/auth/first-login/complete', { method: 'POST' });
            if (cachedSession) cachedSession.firstLogin = false;
        },

        // Change Password
        async changePassword(username, currentPassword, newPassword) {
            const res = await apiRequest('/api/auth/password/change', {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newPassword })
            });
            if (!res.success) {
                return { success: false, message: res.error || 'Password update failed.' };
            }
            return { success: true, message: 'Password updated successfully!' };
        },

        // Update Profile
        async updateProfile(username, data) {
            const res = await apiRequest('/api/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (res.success && cachedSession) {
                Object.assign(cachedSession, data);
                sessionStorage.setItem('BV_ACTIVE_SESSION', JSON.stringify(cachedSession));
            }
            return res.success;
        },

        // Logout
        async logout() {
            await apiRequest('/api/auth/logout', { method: 'POST' });
            cachedSession = null;
            sessionStorage.removeItem('BV_ACTIVE_SESSION');
            window.location.href = '/inventorymanagement/login.html';
        },

        // Admin Management Methods
        async adminGetUsers() {
            const res = await apiRequest('/api/admin/users');
            return res.success ? res : { users: [], stats: {} };
        },

        async adminCreateUser(data) {
            const res = await apiRequest('/api/admin/users', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            if (!res.success) {
                return { success: false, message: res.error || 'Failed to create user.' };
            }
            return { success: true, user: res.user };
        },

        async adminResetPassword(username, newPassword) {
            const res = await apiRequest(`/api/admin/users/${username}/reset-password`, {
                method: 'POST',
                body: JSON.stringify({ newPassword })
            });
            return res;
        },

        async adminToggleStatus(username) {
            const res = await apiRequest(`/api/admin/users/${username}/toggle-status`, {
                method: 'POST'
            });
            return res.success ? res.status : false;
        },

        async adminDeleteUser(username) {
            const res = await apiRequest(`/api/admin/users/${username}`, {
                method: 'DELETE'
            });
            return res;
        },

        async adminResetSecurity(username) {
            const res = await apiRequest(`/api/admin/users/${username}/reset-security`, {
                method: 'POST'
            });
            return res.success;
        },

        // Synchronous backwards-compat getters
        getUsers() {
            return []; // Populated via adminGetUsers
        },

        findUser(username) {
            return cachedSession;
        }
    };
})();

if (typeof window !== 'undefined') {
    window.BVAuth = BVAuth;
}
