/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.util.List;
import junit.framework.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 *
 * @author jvega
 */
public class FirstTest {

    public static String appBaseUrl = "http://dev.synchronit.com/presentation-server-test/web/index.jsp";
    public static String localHostUrl = "http://localhost:8080/web/index.jsp";

    /* @Test
    public void testSimple() throws Exception {
        // Create a new instance of the Firefox driver
        // Notice that the remainder of the code relies on the interface, 
        // not the implementation.
        WebDriver driver = new FirefoxDriver();

        // And now use this to visit Google
        driver.get("http://www.google.com");
        // Alternatively the same thing can be done like this
        // driver.navigate().to("http://www.google.com");

        // Find the text input element by its name
        WebElement element = driver.findElement(By.name("q"));

        // Enter something to search for
        element.sendKeys("Cheese!");

        // Now submit the form. WebDriver will find the form for us from the element
        element.submit();

        // Check the title of the page
        System.out.println("Page title is: " + driver.getTitle());

        // Google's search is rendered dynamically with JavaScript.
        // Wait for the page to load, timeout after 10 seconds
        (new WebDriverWait(driver, 10)).until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver d) {
                return d.getTitle().toLowerCase().startsWith("cheese!");
            }
        });

        // Should see: "cheese! - Google Search"
        System.out.println("Page title is: " + driver.getTitle());

        //Close the browser
        driver.quit();
    }

    @Test
    public void NewFormButtonTest() throws Exception {
        WebDriver driver = new FirefoxDriver();

        // And now use this to visit Google
        driver.get(FirstTest.appBaseUrl);

        WebElement element = driver.findElement(By.cssSelector("a.icon-doc"));
        element.click();
        WebElement formNameElem = driver.findElement(By.id("newFormName"));
        Assert.assertNotNull(formNameElem);

        driver.quit();
    }*/
    @Test
    public void CreateFormTest() throws Exception {
        WebDriver driver = new FirefoxDriver();

        driver.get(FirstTest.localHostUrl);

        List<WebElement> elements = (new WebDriverWait(driver, 10)).until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("treecontrol > ul > li > div > span")));

        if (!elements.isEmpty()) {
            WebElement element = FindElement(elements, "CREATE_CASE");
            element.click();
            WebElement deleteFormButtonElem = driver.findElement(By.cssSelector("#classic a.icon-trash-empty"));
            deleteFormButtonElem.click();
        }
        WebElement element = driver.findElement(By.cssSelector("a.icon-doc"));
        element.click();
        WebElement formNameElem = driver.findElement(By.id("newFormName"));
        formNameElem.sendKeys("CREATE_CASE");

        WebElement dataButtonElem = driver.findElement(By.id("datButton"));
        WebElement runButtonElem = driver.findElement(By.id("runButton"));

        WebElement dataLabelElem = driver.findElement(By.id("newDataLabel"));
        dataLabelElem.sendKeys("fieldText");
        dataButtonElem.click();
        dataLabelElem.sendKeys("FieldNumber");
        Select dropdown = new Select(driver.findElement(By.cssSelector("#new_form > div.formData > div:nth-child(2) > div:nth-child(2) > div.formDataRight > select")));
        dropdown.selectByValue("Number");
        dataButtonElem.click();
        dataLabelElem.sendKeys("FieldBoolean");
        dropdown.selectByValue("Boolean");
        dataButtonElem.click();

        runButtonElem.click();
        WebElement autorefreshElem = driver.findElement(By.id("auto_refresh_btn"));
        autorefreshElem.click();

        (new WebDriverWait(driver, 10)).until(new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver d) {

                List<WebElement> elements = d.findElements(By.cssSelector("treecontrol > ul > li > div > span"));
                return FindElement(elements, "CREATE_CASE") != null;
            }

        });

        driver.quit();
    }

    private WebElement FindElement(List<WebElement> elements, String containString) {
        boolean found = false;
        while (elements.iterator().hasNext() && !found) {
            WebElement current = elements.iterator().next();
            if (current.getText().contains(containString)) {
                return current;
            }
        }
        return null;
    }
}
