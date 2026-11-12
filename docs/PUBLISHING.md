# Publishing daisysbyliv.com

Goal: the `site/` folder on the `publish` branch goes live at https://daisysbyliv.com, with a working launch party sign-up and your Google Workspace email untouched.

## One-time setup (about 30 minutes)

### 1. Put the code on GitHub
1. Create a GitHub account if you do not have one, then a new **private** repository called `daisys-site`.
2. Push the branches from this folder:
   ```bash
   git remote add origin https://github.com/<your-account>/daisys-site.git
   git push -u origin main publish board-improvements
   ```

### 2. Create the site on Netlify
1. Sign up at netlify.com with your GitHub account (free plan).
2. Add new site, Import an existing project, GitHub, choose `daisys-site`.
3. Settings: **Branch to deploy:** `publish`. **Base directory:** leave empty. **Build command:** leave empty. **Publish directory:** `site`.
4. Deploy. Check the temporary `*.netlify.app` address in a browser.

### 3. Connect the domain
1. In Netlify: Domain management, Add a domain, `daisysbyliv.com`.
2. In GoDaddy: My Products, your domain, DNS.
   - Delete the parked/forwarding records for `@` and `www`.
   - Add the records Netlify shows. Usually: an **A** record for `@` and a **CNAME** record for `www` pointing to your `*.netlify.app` address.
   - **Do not touch the MX records or the TXT records** that Google Workspace uses. They keep liv@daisysbyliv.com working.
3. Back in Netlify, wait for the domain to verify, then click Provision certificate so the site uses https.

### 4. Make the sign-up form send you mail
1. After the first deploy, open Forms in Netlify. A form called `launch-party` should be listed.
2. Forms, Settings and usage, Form notifications, Add notification, Email notification to liv@daisysbyliv.com.
3. Submit a test address on the live site and check it arrives.

## Before telling anyone about the site
- [ ] Read the privacy statement at the bottom of the page and confirm it matches how you will use the emails.
- [ ] Confirm you may use the photos publicly (they come from the brand deck).
- [ ] Test on a phone.
- [ ] Decide who sends the launch party invitation and from which address.

## Changing the site later
Edit files in `site/`, commit to the `publish` branch and push. Netlify rebuilds in about a minute.

## Not included on purpose
The scrum board in `board/` is **not** part of the public site. It has no login on a normal website, so it stays private on claude.ai until a protected version is set up.

## The board at daisysbyliv.com/cockpit

Liv's scrum board lives on the site at `/cockpit/`. It is behind a password and its cards are stored in Netlify Blobs (no extra service to set up).

1. In Netlify: Project configuration, Environment variables, add `MANAGE_PASSWORD` with the password Liv will use. Any username works at the prompt.
2. Redeploy (Deploys, Trigger deploy). Until the variable is set, `/cockpit/` and `/api/board` refuse everyone.
3. The page is `site/cockpit/index.html`, the data function is `netlify/functions/board.mjs` and the password check is `netlify/edge-functions/auth.js`.
