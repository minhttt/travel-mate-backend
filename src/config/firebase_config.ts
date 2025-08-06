/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase-admin/app';
import * as admin from 'firebase-admin';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const serviceAccount = {
  type: process.env.type || '',
  project_id: process.env.project_id || '',
  private_key_id: process.env.private_key_id || '',
  private_key: process.env.private_key?.replace(/\\n/g, '\n') || '',
  client_email: process.env.client_email || '',
  client_id: process.env.client_id || '',
  auth_uri: process.env.auth_uri || '',
  token_uri: process.env.token_uri || '',
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url || '',
  client_x509_cert_url: process.env.client_x509_cert_url || '',
  universe_domain: process.env.universe_domain || '',
};

// Initialize Firebase

if (!getApps().length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
  });
}

export const firebaseApp = admin;
export const bucket = admin.storage().bucket();
