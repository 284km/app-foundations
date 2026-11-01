// A generic placeholder generated from text source; replace branding for distribution.
const ICON: &[u8] = &[
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 32, 0, 0, 0, 32, 8, 6,
    0, 0, 0, 115, 122, 122, 244, 0, 0, 0, 48, 73, 68, 65, 84, 120, 156, 237, 206, 33, 1, 0, 0, 8,
    3, 48, 98, 80, 136, 20, 244, 207, 1, 49, 110, 38, 230, 87, 189, 115, 73, 37, 32, 32, 32, 32,
    32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 144, 14, 60, 207, 133, 220, 91, 1, 37, 97, 216, 0, 0,
    0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
];
fn main() {
    let icons = std::path::Path::new("icons");
    std::fs::create_dir_all(icons).expect("Unable to create generated icon directory");
    std::fs::write(icons.join("icon.png"), ICON).expect("Unable to write generated PNG");
    let mut ico = vec![0, 0, 1, 0, 1, 0, 32, 32, 0, 0, 1, 0, 32, 0];
    ico.extend_from_slice(&(ICON.len() as u32).to_le_bytes());
    ico.extend_from_slice(&22u32.to_le_bytes());
    ico.extend_from_slice(ICON);
    std::fs::write(icons.join("icon.ico"), ico).expect("Unable to write generated ICO");
    tauri_build::build()
}
