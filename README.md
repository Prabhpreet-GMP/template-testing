# template-testing

1. Install JDK and setup env variables in mac os(only once -  ask chatgpt for steps with brew)
2. run "nvm use 20"
3. run "npm i"
4. update thymleaf_keys.json, handlebars_keys.json (inside templates folder)
5. run command - npm run generate

## Folder structure
1. raw -> After cherio
2. output_html -> "raw" passed through thymleaf (S3 HTML)
3. output_pdf -> "output_html" passed through openHtmlToPdf library (S3 PDF)
4. output_handlebars -> "raw" passed through handlebars (SES)