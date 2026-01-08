const fs = require('fs');
const cheerio = require('cheerio');
var path = require('path');
var minify = require('html-minifier').minify;
const config =require('./templates/config.json');
const yargs = require('yargs')
const response2 = yargs.argv;
const result = [];
const fileName = `./${config.tenantName}`;
var templateId = 0;
const dirName = path.dirname(fileName);
const utils = require('./templates/utils')
const sesDir = path.join(__dirname, 'templates/ses');

  fs.mkdirSync(`raw/ses`, { recursive: true });
  fs.mkdirSync(`raw/s3`, { recursive: true });

const sesFiles = {};

fs.readdirSync(sesDir).forEach((file) => {
  if (!file.endsWith('.json') || file === '.DS_Store') return;

  const templateName = path.basename(file, '.json');
  const templateJson = require(path.join(sesDir, file));

  if (!templateJson?.Template?.HtmlPart) return;

  sesFiles[templateName] = cheerio.load(templateJson.Template.HtmlPart);
});

const fileConfig = {
  "id": "1",
  "backendParams": [],
  "languages": [{
    "code": "EN",
    "url": "",
    "name": "Sample EN Template 1"
  }]
}

fs.readdir("templates/s3", (err, files) => {
 
  files.forEach((file,index) => {
    templateId=index+1;
    if(file === '.DS_Store'){
      return
    }
   var selector = cheerio.load(fs.readFileSync(`templates/s3/${file}`));
      if(selector("#footerTable")){
        selector("#footerTable").html(utils['footerHtml'])
      }
      if(selector("#footerTablePP")){
        selector("#footerTablePP").html(utils['footerHtml_pp'])
      }
      if(selector(".currencyCode")){
        const elements = selector(".currencyCode");
        elements.each((index,tag)=>{
          selector(tag).text(`${config['currencyCode']}`)
        })
      }

      if(selector("#global")) {
        selector("#global").css({'font-family':config["fontFamily"],'color':config["fontColor"]})
      }

      if(selector('button')){
        selector("button").css({'font-family':config["fontFamily"]})
      }
      
      if (selector(`#${'logo'}`)) {
        selector(`#${'logo'}`).attr('src', config['logo'])
      }

      if (selector("#footerColor")) {
        selector("#footerColor").css({ 'background': config["footerColor"], "color": config["footerFontColor"] });
        selector("#footer").find('*').css("color", config["footerFontColor"]);
      }

      // Social links
      if(config['linkedInUrl'].trim() == '' && config['twitterUrl'].trim() == '' && config['fbUrl'].trim() == ''){
        selector("#socialShare").remove()
      }else{
        if (config['linkedInUrl'].trim() != '' && selector(`#${'linkedInIcon'}`)) {
          selector(`#${'linkedInIcon'}`).attr('href', config['linkedInUrl'])
        }else{
          selector(`#${'linkedInIcon'}`).remove()
        }
  
        if (config['twitterUrl'].trim() != '' && selector(`#${'twitterIcon'}`)) {
          selector(`#${'twitterIcon'}`).attr('href', config['twitterUrl'])
        }else{
          selector(`#${'twitterIcon'}`).remove()
        }
  
        if (config['fbUrl'].trim() != '' && selector(`#${'fbIcon'}`)) {
          selector(`#${'fbIcon'}`).attr('href', config['fbUrl'])
        }else{
          selector(`#${'fbIcon'}`).remove()
        }
      }

      // app & play store links
      if(config['playStoreLink'] == '' && config['appStoreLink'] == ''){
        selector(`#${'appLink'}`).remove()
      }else{
        if (selector(`#${'playStoreLink'}`)) {
          selector(`#${'playStoreLink'}`).attr('href', config['playStoreLink'])
        }
  
        if (selector(`#${'appStoreLink'}`)) {
          selector(`#${'appStoreLink'}`).attr('href', config['appStoreLink'])
        }
      }

      if (selector(`#${'privacy'}`)) {
        selector(`#${'privacy'}`).attr('href', config['privacy'])
      }

      if (selector(`#${'termsAndCondition'}`)) {
        selector(`#${'termsAndCondition'}`).attr('href', config['termsAndCondition'])
      }

      if (config['mobileNo'] != '' && selector(`#${'mobileNo'}`)) {
        selector(`#${'mobileNo'}`).html(config['mobileNo'])
      }else{
        selector(`#${'mobileNo'}`).remove()
      }

      if (selector(`#${'address'}`)) {
        selector(`#${'address'}`).html(config['address'])
      }

      if (selector(`#${'permitBanner'}`)) {
        selector(`#${'permitBanner'}`).attr('src', config['permitBanner'])
      }

      if (selector(`#${'tenantEmail'}`)){
        selector(`#${'tenantEmail'}`).attr('href', `mailto:${config['tenantEmail']}`)
        selector(`#${'tenantEmail'}`).text(config['tenantEmail'])
      }

      if (selector(`#${'tenantEmailOnlyLink'}`)){
        selector(`#${'tenantEmailOnlyLink'}`).attr('href', `mailto:${config['tenantEmail']}`)
      }

      if(selector(`#${'tenantName'}`)){
        selector(`#${'tenantName'}`).text(config['tenantName'])
      }

      if((config['goToFaq'] && config['goToFaq'] != '') || (config['sendUsMail'] && config['sendUsMail'] != '')){
        if(selector(`#${'goToFaq'}`) && config['goToFaq']){
          selector(`#${'goToFaq'}`).attr('href',config['goToFaq'])
          selector("#goToFaq").css({'color':config["fontColor"]})
        }else{
          selector(`#${'goToFaq'}`).remove()
        }
        if(selector(`#${'sendUsMail'}` && config['sendUsMail'])){
          selector(`#${'sendUsMail'}`).attr('href',`mailto:${config['sendUsMail']}`)
          selector("#sendUsMail").css({'color':config["fontColor"]})
        }else{
          selector(`#${'sendUsMail'}`).remove()
        }
      }else{
        if(selector(`#${'haveAQuestion'}`)){
          selector(`#${'haveAQuestion'}`).remove()
        }
      }

      if(selector(`#${'permitRedirect'}`).length != 0 ){
        selector(`#${'permitRedirect'}`).attr('href',`${config['consumerAppUrl']}/app/v2/permits`)
      }

      if(selector(`#${'adminPermitUrl'}`).length != 0 ){
        selector(`#${'adminPermitUrl'}`).attr('href',`${config['dashBoardUrl']}/admin/permit`)
      }

  const h = selector('html *').map((i, x) => selector(x).attr('th:text')).toArray();
  result.push({ ...fileConfig, id: index + 1, backendParams: h, languages: [{ ...fileConfig.languages[0], url: `${fileName}/s3/${file}.html`,name:`sample EN ${file} templates` }, ...fileConfig.languages.slice(1)] })
  const finalS3FileName = generateFileName(`${file.replace(/.html/g, "")}`)

  let str = selector.html().toString()

  fs.writeFileSync(`raw/s3/${finalS3FileName}`, str.replaceAll('&amp;&amp;','&&'));
  fs.writeFileSync(`raw/config.json`, JSON.stringify(result, null, 4));
  });
  if (Object.keys(config).length) {
    // for (data in config) {
      Object.values(sesFiles).map((item, index) => {
        const selector = item;
        updateHTML(selector)
      })
    // }
  }
  Object.keys(sesFiles).map((item, index) => {
    const selector = sesFiles[item];
    var minf = minify(sesFiles[item].html()).replace(/"/g, "'");
    const templateJson = {
      Template: {
        HtmlPart:minf,
        SubjectPart: utils[`${item}`].replace('TENANT_NAME',config['tenantName']),
        TemplateName: `${item}_EN_${config.prefixName}`
      }
    }
    const h = selector('html *').map((i, x) => selector(x).attr('th:text')).toArray();
    result.push({ ...fileConfig, id: index + templateId+1, backendParams: h, languages: [{ ...fileConfig.languages[0], url: `${fileName}/ses/${item}.html`,name:`sample EN ${item} templates` }, ...fileConfig.languages.slice(1)] })
    fs.writeFileSync(`raw/ses/${item}_EN_${config.prefixName}.json`,JSON.stringify(templateJson,null,4)
    );
  })
  fs.writeFileSync(`raw/config.json`, JSON.stringify(result, null, 4));
  fs.writeFileSync(`raw/config_${config.tenantName}.json`, JSON.stringify(config, null, 4));
  
});

function generateFileName(name){
  if(name.includes('_pdf')){
    name = name.replace('_pdf','');
    return `${name}_${config['languageCode']}_${config.prefixName}_pdf.html`
  }else{
    return `${name}_${config['languageCode']}_${config.prefixName}.html`
  }
}

function updateHTML(selector){
  if(selector("#footerTable")){
    selector("#footerTable").html(utils['footerHtml'])
  }
  if(selector("#footerTablePP")){
    selector("#footerTablePP").html(utils['footerHtml_pp'])
  }
  if(selector(".currencyCode")){
    const elements = selector(".currencyCode");
    elements.each((index,tag)=>{
      selector(tag).text(`${config['currencyCode']} `)
    })
  }

  if(selector("#global")) {
    selector("#global").css({'font-family':config["fontFamily"],'color':config["fontColor"]})
  }

  if(selector('button')){
    selector("button").css({'font-family':config["fontFamily"]})
  }
  
  if (selector(`#${'logo'}`)) {
    selector(`#${'logo'}`).attr('src', config['logo'])
  }

  if (selector("#footerColor")) {
    selector("#footerColor").css({ 'background': config["footerColor"], "color": config["footerFontColor"] });
    selector("#footer").find('*').css("color", config["footerFontColor"]);
  }

  // Social links
  if(config['linkedInUrl'].trim() == '' && config['twitterUrl'].trim() == '' && config['fbUrl'].trim() == ''){
    selector("#socialShare").remove()
  }else{
    if (config['linkedInUrl'].trim() != '' && selector(`#${'linkedInIcon'}`)) {
      selector(`#${'linkedInIcon'}`).attr('href', config['linkedInUrl'])
    }else{
      selector(`#${'linkedInIcon'}`).remove()
    }

    if (config['twitterUrl'].trim() != '' && selector(`#${'twitterIcon'}`)) {
      selector(`#${'twitterIcon'}`).attr('href', config['twitterUrl'])
    }else{
      selector(`#${'twitterIcon'}`).remove()
    }

    if (config['fbUrl'].trim() != '' && selector(`#${'fbIcon'}`)) {
      selector(`#${'fbIcon'}`).attr('href', config['fbUrl'])
    }else{
      selector(`#${'fbIcon'}`).remove()
    }
  }

  // app & play store links
  if(config['playStoreLink'] == '' && config['appStoreLink'] == ''){
    selector(`#${'appLink'}`).remove()
  }else{
    if (selector(`#${'playStoreLink'}`)) {
      selector(`#${'playStoreLink'}`).attr('href', config['playStoreLink'])
    }

    if (selector(`#${'appStoreLink'}`)) {
      selector(`#${'appStoreLink'}`).attr('href', config['appStoreLink'])
    }
  }

  if (selector(`#${'privacy'}`)) {
    selector(`#${'privacy'}`).attr('href', config['privacy'])
  }

  if (selector(`#${'termsAndCondition'}`)) {
    selector(`#${'termsAndCondition'}`).attr('href', config['termsAndCondition'])
  }

  if (config['mobileNo'] != '' && selector(`#${'mobileNo'}`)) {
    selector(`#${'mobileNo'}`).html(config['mobileNo'])
  }else{
    selector(`#${'mobileNo'}`).remove()
  }

  if (selector(`#${'address'}`)) {
    selector(`#${'address'}`).html(config['address'])
  }

  if (selector(`#${'permitBanner'}`)) {
    selector(`#${'permitBanner'}`).attr('src', config['permitBanner'])
  }

  if (selector(`#${'tenantEmail'}`)){
    selector(`#${'tenantEmail'}`).attr('href', `mailto:${config['tenantEmail']}`)
    selector(`#${'tenantEmail'}`).text(config['tenantEmail'])
  }
  if (selector(`#${'tenantEmailOnlyLink'}`)){
    selector(`#${'tenantEmailOnlyLink'}`).attr('href', `mailto:${config['tenantEmail']}`)
  }

  if(selector(`#${'tenantName'}`)){
    selector(`#${'tenantName'}`).text(config['tenantName'])
  }

  if(selector(`.${'tenantName'}`)){
    selector(`.${'tenantName'}`).text(config['tenantName'])
  }

  if((config['goToFaq'] && config['goToFaq'] != '') || (config['sendUsMail'] && config['sendUsMail'] != '')){
    if(selector(`#${'goToFaq'}`) && config['goToFaq']){
      selector(`#${'goToFaq'}`).attr('href',config['goToFaq'])
      selector("#goToFaq").css({'color':config["fontColor"]})
    }else{
      selector(`#${'goToFaq'}`).remove()
    }
    if(selector(`#${'sendUsMail'}` && config['sendUsMail'])){
      selector(`#${'sendUsMail'}`).attr('href',`mailto:${config['sendUsMail']}`)
    }else{
      selector(`#${'sendUsMail'}`).remove()
    }
  }else{
    if(selector(`#${'haveAQuestion'}`)){
      selector(`#${'haveAQuestion'}`).remove()
    }
  }
}