import { test, expect } from '@playwright/test';

test.describe('App Stability', () => {
  test('should iterate through many math problems without freezing', async ({ page }) => {
    // Increase timeout to allow for animations (1.5s per iteration * 20 = 30s+)
    test.setTimeout(120000);

    // 1. Navigate to home
    await page.goto('/');
    
    // Ensure the app is loaded
    await expect(page.locator('h1')).toContainText(/Math Practice|Mathe-Übung|Esercizi|Exercices|Praktikë/);

    const iterations = 50;

    // eslint-disable-next-line no-console
    console.log(`Starting ${iterations} iterations of solve-and-refresh...`);

    for (let i = 0; i < iterations; i++) {
      // 2. Extract problem data from the DOM
      // The structure is: <span>{num1}</span> <span>{op}</span> <span>{num2}</span> ...
      // We can locate the problem container
      const container = page.locator('.math-problem-container');
      
      // Get the text content of the problem numbers
      // Note: The spans are direct children of the flex container div inside .math-problem-container
      // Structure: div.text-5xl > span
      const spans = container.locator('.text-5xl > span');
      
      // We expect at least 3 spans: num1, op, num2
      const num1Text = await spans.nth(0).textContent();
      const opText = await spans.nth(1).textContent();
      const num2Text = await spans.nth(2).textContent();
      
      const num1 = parseInt(num1Text || '0', 10);
      const num2 = parseInt(num2Text || '0', 10);
      
      let expectedAnswer = 0;
      // Convert op symbol to logic
      switch (opText) {
        case '+': expectedAnswer = num1 + num2; break;
        case '-': expectedAnswer = num1 - num2; break;
        case '×': expectedAnswer = num1 * num2; break;
        case '÷': expectedAnswer = num1 / num2; break;
        default: throw new Error(`Unknown operator: ${opText}`);
      }
      
      // 3. Find and click the correct answer button
      // The answer buttons are in the ResultGrid
      // We need to match the button with the exact text of the answer
      // Round to 2 decimals if needed (display logic in app uses rounding)
      const displayAnswer = Math.round(expectedAnswer * 100) / 100;
      const answerBtn = page.locator(`button`, { hasText: `${displayAnswer}` }).first();
      
      // Check if button exists (it should!)
      await expect(answerBtn).toBeVisible();
      
      // Click it
      await answerBtn.click();
      
      // 4. Wait for the "Correct!" feedback
      await expect(container).toContainText(/Correct|Richtig|Corretto|Saktë/);
      
      // 5. Wait for the new problem to appear
      // The feedback element is removed from the DOM when the next problem loads
      await expect(container.getByRole('status')).not.toBeVisible({ timeout: 3000 });
      
      // Optional: Verify the numbers changed (unless by chance they are the same, which is rare but possible)
      // For stability test, just reaching this point implies the app didn't freeze.
    }

    // eslint-disable-next-line no-console
    console.log('Stability test completed successfully.');
  });

  test('should handle rapid "New Problem" clicks', async ({ page }) => {
    await page.goto('/');
    const newProblemBtn = page.getByRole('button', { name: /New Problem|Neue Aufgabe|Nuovo Problema|Nouveau Problème|Problem i Ri/i });
    
    for (let i = 0; i < 20; i++) {
      await newProblemBtn.click();
      // Wait a tiny bit to ensure the event loop processes
      await page.waitForTimeout(50); 
    }
    
    // If we are here, the main thread didn't lock up
    await expect(page.locator('.math-problem-container')).toBeVisible();
  });
});
