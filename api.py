import requests
import json

def create_payload(user_message, temperature=0.7, stream=False):
    return {
        "model": "llama3",
        "messages": [
            {"role": "assistant", "content": "You are a Data Engineer with more than 30 years of experience in Health field. Help as good as you can so the user gets the best solution for each use case."},
            {"role": "user", "content": user_message},
        ],
        "format": "json",
        "stream": stream,
        "options": {
            "temperature": temperature
        }
    }

def call_api(api_url, payload):
    try:
        response = requests.post(api_url, json=payload)
        response.raise_for_status()  # Raise HTTPError for bad responses
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")
    return None

def main():
    api_url = "http://localhost:11434/api/chat"  # Replace with your actual API URL
    user_message = "Hello, I need Data Engineering advice for this case:"
    payload = create_payload(user_message)

    response_data = call_api(api_url, payload)
    if response_data:
        print(json.dumps(response_data, indent=4))
    else:
        print("Failed to get a valid response from the API.")

if __name__ == "__main__":
    main()
