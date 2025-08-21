import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

url = "https://chatapp-4vr7.onrender.com"

@pytest.fixture
def drv():
  opt = Options()
  opt.add_argument("--headless")
  d = webdriver.Chrome(options=opt)
  yield d
  d.quit()

class Testchat:
  
  def test_home(self, drv):
    drv.get(url)
    assert "samvad" in drv.title.lower()

  def test_login_page(self, drv):
    drv.get(url + "/login")
    em = WebDriverWait(drv,10).until(
      EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-testid='input-email']"))
    )
    assert em.is_displayed()

  def test_signup_page(self, drv):
    drv.get(url + "/signup")
    nm = WebDriverWait(drv,10).until(
      EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-testid='input-fullname']"))
    )
    assert nm.is_displayed()

  def test_login_form(self, drv):
    drv.get(url + "/login")
    drv.find_element(By.CSS_SELECTOR, "[data-testid='input-email']").send_keys("test@test.com")
    drv.find_element(By.CSS_SELECTOR, "[data-testid='input-password']").send_keys("password123")
    btn = WebDriverWait(drv,10).until(
      EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='button-login']"))
    )
    assert btn.is_enabled()

  def test_signup_form(self, drv):
    drv.get(url + "/signup")
    drv.find_element(By.CSS_SELECTOR, "[data-testid='input-fullname']").send_keys("test user")
    drv.find_element(By.CSS_SELECTOR, "[data-testid='input-email']").send_keys("test@test.com")
    drv.find_element(By.CSS_SELECTOR, "[data-testid='input-password']").send_keys("password123")
    btn = WebDriverWait(drv,10).until(
      EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='button-signup']"))
    )
    assert btn.is_enabled()

  def test_nav(self, drv):
    drv.get(url + "/login")
    lk = WebDriverWait(drv,10).until(
      EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='link-signup']"))
    )
    lk.click()
    WebDriverWait(drv,10).until(EC.url_contains("/signup"))
    assert "/signup" in drv.current_url
