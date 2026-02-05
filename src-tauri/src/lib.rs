use serde_json::{Value, json};
use reqwest::Client;
use tauri::{command, AppHandle, Emitter};
use futures::StreamExt;

#[command]
async fn call_api(
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

    let resp = req.send().await.map_err(|e| e.to_string())?;
    let status = resp.status().as_u16();

    let text = resp.text().await.map_err(|e| e.to_string())?;

    // Try to parse JSON
    let json_result = serde_json::from_str::<Value>(&text).unwrap_or(json!({ "raw": text }));

    if status >= 400 {
        return Err(format!("Request failed ({}): {}", status, json_result));
    }

    Ok(json_result)
}

#[command]
// stream_api for chat page in frontend for better responses
async fn stream_api(
    app: AppHandle,
    stream_id: String,
    method: String,
    url: String,
    headers: Option<String>,
    body: Option<String>,
) -> Result<(), String> {
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

    // Send request and get response
    let resp = req.send().await.map_err(|e| {
        let error_msg = e.to_string();
        let _ = app.emit(&format!("stream-error-{}", stream_id), json!({ "error": error_msg }));
        error_msg
    })?;

    let status = resp.status();
    
    if !status.is_success() {
        let error_msg = format!("Request failed with status: {}", status);
        let _ = app.emit(&format!("stream-error-{}", stream_id), json!({ "error": &error_msg }));
        return Err(error_msg);
    }

    // Stream the response body
    let mut stream = resp.bytes_stream();

    while let Some(chunk_result) = stream.next().await {
        match chunk_result {
            Ok(chunk) => {
                // Convert bytes to string
                if let Ok(text) = String::from_utf8(chunk.to_vec()) {
                    // Emit chunk event
                    let _ = app.emit(
                        &format!("stream-chunk-{}", stream_id),
                        json!({ "chunk": text })
                    );
                }
            }
            Err(e) => {
                let error_msg = e.to_string();
                let _ = app.emit(&format!("stream-error-{}", stream_id), json!({ "error": error_msg }));
                return Err(error_msg);
            }
        }
    }

    // Emit completion event
    let _ = app.emit(&format!("stream-complete-{}", stream_id), json!({ "done": true }));

    Ok(())
}

#[command]
async fn chat_api(url: String, body: String) -> Result<String, String> {
    let client = Client::new();

    let req = client
        .post(&url)
        .header("Content-Type", "application/json")
        .body(body);

    let resp = req.send().await.map_err(|e| e.to_string())?;
    let status = resp.status();
    let text = resp.text().await.map_err(|e| e.to_string())?;

    if status.is_client_error() || status.is_server_error() {
        return Err(format!("Request failed ({}): {}", status, text));
    }

    Ok(text)
}

#[tauri::command]
fn greet() -> String {
    format!("Hello AJ7!")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, call_api, chat_api, stream_api])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
