// Client-side function to show popup
frappe.demo_popup = {
    show: function(message) {
        // Call server method
        frappe.call({
            method: "demo_app.api.show_demo_popup",
            args: {
                message: message || "Hello from Demo App!"
            },
            callback: function(response) {
                if (response.message && response.message.status === "success") {
                    // Show popup with response data
                    frappe.demo_popup.display_popup(response.message);
                } else {
                    frappe.msgprint({
                        title: "Error",
                        message: "Failed to load demo popup data",
                        indicator: "red"
                    });
                }
            },
            error: function(err) {
                console.error("Demo popup error:", err);
                frappe.msgprint({
                    title: "Error",
                    message: "An error occurred while loading the popup",
                    indicator: "red"
                });
            }
        });
    },

    display_popup: function(data) {
        const popup_html = `
            <div class="demo-popup-content">
                <h4>Demo App Information</h4>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Message:</strong> ${data.message}</p>
                        <p><strong>User:</strong> ${data.user_info.full_name}</p>
                        <p><strong>Email:</strong> ${data.user_info.email}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Site:</strong> ${data.site}</p>
                        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
                        <p><strong>Role:</strong> ${data.user_info.role_profile || 'Not Set'}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <button class="btn btn-primary btn-sm" onclick="frappe.demo_popup.get_system_info()">
                        Get System Info
                    </button>
                </div>
            </div>
        `;

        const dialog = new frappe.ui.Dialog({
            title: "Demo App Popup",
            size: "large",
            fields: [
                {
                    fieldtype: "HTML",
                    fieldname: "popup_content",
                    options: popup_html
                }
            ],
            primary_action_label: "Close",
            primary_action: function() {
                dialog.hide();
            }
        });

        dialog.show();
    },

    get_system_info: function() {
        frappe.call({
            method: "demo_app.api.get_system_info",
            callback: function(response) {
                if (response.message) {
                    frappe.msgprint({
                        title: "System Information",
                        message: `
                            <p><strong>Frappe Version:</strong> ${response.message.frappe_version}</p>
                            <p><strong>Site:</strong> ${response.message.site_name}</p>
                            <p><strong>Database:</strong> ${response.message.db_name}</p>
                            <p><strong>Total Users:</strong> ${response.message.total_users}</p>
                            <p><strong>Total Companies:</strong> ${response.message.total_companies}</p>
                        `,
                        indicator: "blue"
                    });
                }
            }
        });
    }
};

// Make it globally available
window.demo_popup = frappe.demo_popup;
