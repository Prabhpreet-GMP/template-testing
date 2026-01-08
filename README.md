# template-testing

1. Install JDK and setup env variables in mac os(only once -  ask chatgpt for steps with brew)
2. run "npm i"
3. update the config.json, thymleaf_keys.json, handlebars_keys.json (inside templates folder)
4. run command - npm run generate

## Folder structure
raw -> After cherio
output_html -> "raw" passed through thymleaf (S3 HTML)
output_pdf -> "output_html" passed through openHtmlToPdf library (S3 PDF)
output_handlebars -> "raw" passed through handlebars (SES)

