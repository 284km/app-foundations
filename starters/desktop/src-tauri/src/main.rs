#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;

#[tauri::command]
fn export_notes(app: tauri::AppHandle, notes_json: String) -> Result<(), String> {
    if notes_json.len() > 1_048_576 {
        return Err("Export exceeds 1 MiB".into());
    }
    let value: serde_json::Value = serde_json::from_str(&notes_json).map_err(|_| "Invalid JSON")?;
    if !value.is_array() {
        return Err("Expected an array of notes".into());
    }
    // Fixed app-owned destination. The WebView cannot choose an arbitrary file path.
    let directory = app
        .path()
        .app_data_dir()
        .map_err(|_| "Application data directory is unavailable")?;
    std::fs::create_dir_all(&directory).map_err(|_| "Unable to create the export directory")?;
    std::fs::write(directory.join("notes-export.json"), notes_json)
        .map_err(|_| "Unable to write the export".to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![export_notes])
        .run(tauri::generate_context!())
        .expect("Unable to start the desktop application");
}
