import frappe

@frappe.whitelist()
def show_demo_popup(message="Hello from Demo App!"):
    """
    Server-side method that can be called from any DocType server script
    Returns data to show in a popup
    """
    try:
        # Get current user info
        user = frappe.session.user
        user_doc = frappe.get_doc("User", user)
        
        # Prepare response data
        response_data = {
            "status": "success",
            "message": message,
            "user_info": {
                "full_name": user_doc.full_name,
                "email": user_doc.email,
                "role_profile": user_doc.role_profile_name
            },
            "timestamp": frappe.utils.now(),
            "site": frappe.local.site
        }
        
        return response_data
        
    except Exception as e:
        frappe.log_error(f"Error in show_demo_popup: {str(e)}")
        return {
            "status": "error",
            "message": f"Error occurred: {str(e)}"
        }

@frappe.whitelist()
def get_system_info():
    """
    Additional method to get system information
    """
    return {
        "frappe_version": frappe.__version__,
        "site_name": frappe.local.site,
        "db_name": frappe.conf.db_name,
        "total_users": frappe.db.count("User", {"enabled": 1}),
        "total_companies": frappe.db.count("Company")
    }
