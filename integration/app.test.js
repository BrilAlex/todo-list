describe("addItemForm", () => {
  it("Base example, visually looks correct", async () => {
    // APIs from jest-puppeteer
    await page.goto("http://localhost:9009/iframe.html?id=todolist-additemform--add-item-form-example&args=&viewMode=story");
    const image = await page.screenshot();

    // API from jest-image-snapshot
    expect(image).toMatchImageSnapshot();
  });
});

describe("EditableSpan", () => {
  it("Base example, visually looks correct", async () => {
    // APIs from jest-puppeteer
    await page.goto("http://localhost:9009/iframe.html?id=todolist-editablespan--editable-span-example&args=&viewMode=story");
    const image = await page.screenshot();

    // API from jest-image-snapshot
    expect(image).toMatchImageSnapshot();
  });
});

describe("Task", () => {
  it("Completed task example, visually looks correct", async () => {
    // APIs from jest-puppeteer
    await page.goto("http://localhost:9009/iframe.html?id=todolist-task--task-is-done&args=&viewMode=story");
    const image = await page.screenshot();

    // API from jest-image-snapshot
    expect(image).toMatchImageSnapshot();
  });

  it("Not completed task example, visually looks correct", async () => {
    // APIs from jest-puppeteer
    await page.goto("http://localhost:9009/iframe.html?id=todolist-task--task-is-not-done&args=&viewMode=story");
    const image = await page.screenshot();

    // API from jest-image-snapshot
    expect(image).toMatchImageSnapshot();
  });
});