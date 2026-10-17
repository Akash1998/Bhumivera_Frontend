import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ReturnsCentre() {
  return <Navigate to="/verify" replace />;
}
