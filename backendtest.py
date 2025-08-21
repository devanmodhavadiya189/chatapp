import pytest
import requests

base_url = "https://chatty-pv9k.onrender.com"
api_url = f"{base_url}/api"

def test_server_running():
  r = requests.get(base_url)
  assert r.status_code == 200
  assert "server is alive" in r.text.lower()

def test_signup():
  data = {"fullname":"test user","email":"test@example.com","password":"password123"}
  r = requests.post(f"{api_url}/auth/signup", json=data)
  assert r.status_code in [201,400]

def test_login():
  data = {"email":"test@example.com","password":"password123"}
  r = requests.post(f"{api_url}/auth/login", json=data)
  assert r.status_code in [200,404]

def test_invalid_login():
  data = {"email":"test@example.com","password":"wrongpassword"}
  r = requests.post(f"{api_url}/auth/login", json=data)
  assert r.status_code == 404

def test_auth_check_without_login():
  r = requests.get(f"{api_url}/auth/check")
  assert r.status_code == 401

def test_users_without_auth():
  r = requests.get(f"{api_url}/message/users")
  assert r.status_code == 401

def test_logout():
  r = requests.post(f"{api_url}/auth/logout")
  assert r.status_code == 200

def test_invalid_endpoint():
  r = requests.get(f"{api_url}/invalid")
  assert r.status_code == 404

def test_signup_missing_data():
  data = {"email":"test@test.com"}
  r = requests.post(f"{api_url}/auth/signup", json=data)
  assert r.status_code == 400

def test_login_missing_data():
  data = {"email":"test@test.com"}
  r = requests.post(f"{api_url}/auth/login", json=data)
  assert r.status_code == 404
