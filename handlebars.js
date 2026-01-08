const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const data = require('./templates/handlebars_keys.json')

// INPUT / OUTPUT folders
const inputDir = path.join(__dirname, './raw/ses')
const outputDir = 'output_handlebars'

// Create output folder if not exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Read all files from input folder
const files = fs.readdirSync(inputDir)

console.log("---------SES GENERATION STARTED---------")

// Process each template
files.forEach((file) => {
  try{
    // Only process JSON files
  if (!file.endsWith('.json')) return

  const templatePath = path.join(inputDir, file)
  const templateJson = require(templatePath)

  const html = templateJson.Template.HtmlPart
  const compiledHtml = Handlebars.compile(html)(data)

  const outputPath = path.join(outputDir, file.replace('.json', '.html'))

  fs.writeFileSync(outputPath, compiledHtml, 'utf8')

  console.log(`- GENERATED: ${file}`)
  }
  catch (e){
    console.log(`- FAILED: ${file}`)
    console.log(e)
  }
})
