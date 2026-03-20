import React from "react";
import { User, Moon } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <div className="page-wrapper animate-slide-up">
      <div className="page-header mb-4">
        <h1 className="page-title mb-1">Settings & Preferences</h1>
        <p className="page-subtitle mb-0">Manage your account and app settings</p>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="glass-panel text-center p-5 rounded-4 shadow-sm h-100">
            <div className="avatar mx-auto mb-3 flex-center align-items-center justify-content-center bg-primary-subtle text-primary border-4 border-white shadow-sm" style={{ width: 100, height: 100, fontSize: '3rem' }}>
              A
            </div>
            <h4 className="fw-bold mb-0">Admin User</h4>
            <p className="text-muted small">Business Owner</p>
            <div className="mt-4">
              <button className="btn btn-outline-primary rounded-pill px-4">Edit Profile</button>
            </div>
            <div className="mt-4 pt-4 border-top">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Status</span>
                <span className="badge bg-success-subtle text-success">Active</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Member Since</span>
                <span className="fw-medium">Mar 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-4">General Settings</h5>

            <div className="list-group list-group-flush settings-list">
              <div className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent border-bottom-subtle px-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="icon-circle bg-light-subtle text-muted">
                    <User size={20} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Personal Information</h6>
                    <span className="text-muted small">Update your name, email, and phone number</span>
                  </div>
                </div>
                <button className="btn btn-link text-decoration-none">Update</button>
              </div>

              <div className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent border-bottom-subtle px-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="icon-circle bg-light-subtle text-muted">
                    <Palette size={20} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Appearance</h6>
                    <span className="text-muted small">Toggle between light and dark themes</span>
                  </div>
                </div>
                <div className="form-check form-switch fs-5">
                  <input className="form-check-input" type="checkbox" role="switch" checked={theme === 'dark'} onChange={toggleTheme} />
                </div>
              </div>

              <div className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent border-bottom-subtle px-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="icon-circle bg-light-subtle text-muted">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Notifications</h6>
                    <span className="text-muted small">Manage email and push notification alerts</span>
                  </div>
                </div>
                <button className="btn btn-link text-decoration-none">Configure</button>
              </div>

              <div className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent border-bottom-subtle px-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="icon-circle bg-light-subtle text-muted">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Security</h6>
                    <span className="text-muted small">Change password and manage 2FA settings</span>
                  </div>
                </div>
                <button className="btn btn-link text-decoration-none">Manage</button>
              </div>

              <div className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent border-bottom-subtle px-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="icon-circle bg-light-subtle text-muted">
                    <Download size={20} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Data Export</h6>
                    <span className="text-muted small">Download all your customer and transaction data</span>
                  </div>
                </div>
                <button className="btn btn-outline-secondary btn-sm px-3 rounded-pill" onClick={() => alert("Downloading all backup...")}>Backup Now</button>
              </div>
            </div>

            <div className="mt-4 pt-3 text-end">
              <button className="btn btn-primary px-4 shadow-sm rounded-pill">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
