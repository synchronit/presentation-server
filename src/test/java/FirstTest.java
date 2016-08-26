/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.Console;
import java.util.Iterator;
import java.util.List;
import junit.framework.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
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

    @Ignore
    @Test
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
         (new WebDriverWait(driver, 30)).until(ExpectedConditions.alertIsPresent());
        Alert alert = driver.switchTo().alert();
        alert.accept();
        WebElement element = driver.findElement(By.cssSelector("a.icon-doc"));
        element.click();
        WebElement formNameElem = driver.findElement(By.id("newFormName"));
        driver.quit();
        Assert.assertNotNull(formNameElem);
    }

    @Test
    public void CreateFormTest() throws Exception {
        WebDriver driver = new FirefoxDriver();

        driver.get(FirstTest.appBaseUrl);
        //driver.findElements(By.cssSelector("treecontrol > ul > li > div > span")); //
        (new WebDriverWait(driver, 30)).until(ExpectedConditions.alertIsPresent());
        Alert alert = driver.switchTo().alert();
        alert.accept();
        WebElement autorefreshElem = driver.findElement(By.id("auto_refresh_btn"));
        List<WebElement> elements = (new WebDriverWait(driver, 30)).until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("treecontrol > ul > li > div > span")));
        System.out.println("Tree count elements is: " + elements.size());
        autorefreshElem.click();
        System.out.println("SETTING AUTO REFRESH");
        if (!elements.isEmpty()) {
            System.out.println("Elements founds");
            WebElement element = FindElement(elements, "CREATE_CASE");
            if (element != null) {
                DeleteElement(element, driver);
                WebElement notifycationElem = (new WebDriverWait(driver, 30)).until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#msgFooter[style=\"display: block;\"]")));
                (new WebDriverWait(driver, 30)).until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#msgFooter[style=\"display: none;\"]")));
                System.out.println("CREATE_CASE element not Present");
            } else {
                System.out.println("CREATE_CASE element not found");
            }
        }//101, 104

        WebElement createForm = driver.findElement(By.cssSelector("a.icon-doc"));
        createForm.click();
        System.out.println("Selecting New Form Button");
        WebElement formNameElem = (new WebDriverWait(driver, 30)).until(ExpectedConditions.presenceOfElementLocated(By.id("newFormName")));

        if (formNameElem != null) {
            formNameElem.sendKeys("CREATE_CASE");
            System.out.println("Putting form Name");
        } else {
            System.out.println("FormName not found");
        }

        WebElement dataButtonElem = driver.findElement(By.id("datButton"));
        WebElement runButtonElem = driver.findElement(By.id("runButton"));

        WebElement dataLabelElem = driver.findElement(By.id("newDataLabel"));
        dataLabelElem.sendKeys("fieldText");
        dataButtonElem.click();
        System.out.println("Setting field text");
        dataLabelElem.sendKeys("FieldNumber");
        System.out.println("Selecting Field text");
        Select dropdown = new Select(driver.findElement(By.cssSelector("#new_form > div.formData > div:nth-child(2) > div:nth-child(2) > div.formDataRight > select")));
        dropdown.selectByValue("Number");
        dataButtonElem.click();
        System.out.println("Setting field Number");
        dataLabelElem.sendKeys("FieldBoolean");
        dropdown.selectByValue("Boolean");
        dataButtonElem.click();
        System.out.println("Setting field boolean ");

        runButtonElem.click();
        System.out.println("Running create form");

        //autorefreshElem.click();
        //System.out.println("Setting auto refresh");
////*[@id="classic"]/div/div/div/div/div/treecontrol/ul/li[20]/div/span
        WebElement element = (new WebDriverWait(driver, 30)).until(ExpectedConditions.presenceOfElementLocated(By.xpath("//treecontrol//li//div/span[contains(text(), \"CREATE_CASE\")]")));
        //WebElement element = FindElement(elements, "CREATE_CASE");
        System.out.println("Finding new form");
        if (element != null) {
            System.out.println("Form CREATE_CASE found!!! Ready to create Case");
            element.click();
            WebElement field1 = driver.findElement(By.xpath("//*[@id=\"form-content\"]/div/div[3]/div/div/div[2]/div/input"));
            field1.sendKeys("CREATE_CASE field Text");
            System.out.println("Field1 Set");
            WebElement field2 = driver.findElement(By.xpath("//*[@id=\"form-content\"]/div/div[4]/div/div/div[2]/div/div/input"));
            field2.sendKeys("5");
            System.out.println("Field2 Set");
            WebElement field3 = driver.findElement(By.xpath("//*[@id=\"form-content\"]/div/div[5]/div/div/div[2]/div/input"));
            field3.click();
            System.out.println("Field3 Set");
            WebElement createButtonElem = driver.findElement(By.cssSelector("a[class=\"icon-create\"]"));
            createButtonElem.click();
            System.out.println("Creating case");
            WebElement notifycationElem = (new WebDriverWait(driver, 30)).until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#msgFooter[style=\"display: block;\"]")));
            System.out.println("Rsiving message");
            WebElement msg = notifycationElem.findElement(By.cssSelector("#notificationMsg"));

            System.out.println(msg.getText());
            System.out.println("Message contain code 101: " + msg.getText().contains("101"));
            //DeleteElement(element, driver);
            String message = msg.getText();
            driver.quit();
            Assert.assertEquals(true, message.contains("101"));

        } else {
            driver.quit();
            Assert.fail();
        }

    }

    private void DeleteElement(WebElement element, WebDriver driver) {
        List<WebElement> elements;
        element.click();
        System.out.println("CREATE_CASE element Clicked");
        WebElement deleteFormButtonElem = driver.findElement(By.cssSelector("#classic a.icon-trash-empty"));
        deleteFormButtonElem.click();
        elements = driver.findElements(By.cssSelector("treecontrol > ul > li > div > span"));
        element = FindElement(elements, "CREATE_CASE");
        if (element == null) {
            System.out.println("CREATE_CASE element Deleted");
        }
    }

    private WebElement FindElement(List<WebElement> elements, String containString) {
        System.out.println("Init find");
        boolean found = false;
        Iterator<WebElement> iterator = elements.iterator();

        while (iterator.hasNext() && !found) {
            System.out.println("ITERATION");
            WebElement current = iterator.next();
            if (current.getText().contains(containString)) {
                System.out.println("CREATE_CASE element just found");
                return current;
            }
        }
        System.out.println("CREATE_CASE element not found");
        return null;
    }
}
