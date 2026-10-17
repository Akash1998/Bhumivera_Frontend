import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Returns() {
  return <Navigate to="/verify" replace />;
}
