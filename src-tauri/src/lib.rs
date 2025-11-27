use serde_json::{Value, json};
use reqwest::blocking::Client;
use tauri::command;

#[command]
fn call_api(
    method: String,
    url: String,
    headers: Option<String>,
    body: Option<String>,
) -> Result<Value, String> {

    let client = Client::new();

    let method = method
        .parse::<reqwest::Method>()
        .unwrap_or(reqwest::Method::GET);

    let mut req = client.request(method, &url);

    // Headers
    if let Some(h) = headers {
        if let Ok(map) = serde_json::from_str::<Value>(&h) {
            if let Some(obj) = map.as_object() {
                for (k, v) in obj {
                    if let Some(val) = v.as_str() {
                        req = req.header(k, val);
                    }
                }
            }
        }
    }

    // Body
    if let Some(b) = body {
        req = req.body(b);
    }

    let resp = req.send().map_err(|e| e.to_string())?;
    let status = resp.status().as_u16();

    let text = resp.text().map_err(|e| e.to_string())?;

    // Try to parse JSON
    let json_result = serde_json::from_str::<Value>(&text).unwrap_or(json!({ "raw": text }));

    if status >= 400 {
        return Err(format!("Request failed ({}): {}", status, json_result));
    }

    Ok(json_result)
}

#[command]
async fn chat_api(url: String, body: String) -> Result<String, String> {
    // Run blocking reqwest inside a safe thread pool
    let result = tauri::async_runtime::spawn_blocking(move || {
        let client = reqwest::blocking::Client::new();

        let req = client
            .post(&url)
            .header("Content-Type", "application/json")
            .body(body);

        // BLOCKING — but now safely off the main thread
        let resp = req.send().map_err(|e| e.to_string())?;
        let status = resp.status();
        let text = resp.text().map_err(|e| e.to_string())?;

        if status.is_client_error() || status.is_server_error() {
            return Err(format!("Request failed ({}): {}", status, text));
        }

        Ok(text)
    })
    .await
    .map_err(|e| format!("Thread join error: {e}"))?;

    result
}

#[tauri::command]
fn greet() -> String {
    format!("Hello AJ7!")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, call_api, chat_api])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
