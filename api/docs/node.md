# Debugging Node.js with Chrome DevTools

Node.js provides built-in support for debugging using Chrome DevTools. This allows you to inspect, set breakpoints, and step through your server-side code just like you would with client-side JavaScript.

## How to Enable Debugging

1. **Start Node.js with the Inspector**

   Use the `--inspect` flag to start your server with debugging enabled.  
   You can use the script defined in your `package.json`:

   ```sh
   npm run start:debug
   ```

   Or run manually:

   ```sh
   node --inspect ./bin/www
   ```

   > For debugging from the very first line, use `--inspect-brk` instead.

2. **Open Chrome DevTools for Node.js**

   - Open Chrome and navigate to:  
     ```
     chrome://inspect
     ```
   - Under "Remote Target", you should see your Node.js process.
   - Click "Open dedicated DevTools for Node" to launch the debugger.

3. **Debugging Features**

   - Set breakpoints in your Node.js code.
   - Step through execution (step in, out, over).
   - Inspect variables, call stacks, and watch expressions.
   - View console output and errors.

## Tips

- Make sure your Node.js process is running with the inspector enabled before opening Chrome DevTools.
- You can use environment variables like `DEBUG=api:*` to enable verbose logging in your app alongside the debugger.
- If you have multiple Node.js processes, each will show up in the "Remote Target" list.

## Example Workflow

1. Start your server in debug mode:
   ```sh
   npm run start:debug
   ```
2. Open Chrome and go to `chrome://inspect`.
3. Click "Open dedicated DevTools for Node".
4. Set breakpoints and begin debugging!

---

**References:**
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)