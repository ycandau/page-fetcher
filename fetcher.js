const request = require('request')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const pathDef = './index.html'
const urlDef = 'http://www.example.edu'

//------------------------------------------------------------------------------
// Read arguments

const readArguments = () => {
  const [url, path] = process.argv.slice(2)
  return { url: url || urlDef, path: path || pathDef }
}

//------------------------------------------------------------------------------
// Check if the path is valid

const checkPathIsValid = (argv) => {
  const dirname = path.dirname(argv.path)
  fs.access(dirname, (err) => {
    if (err) {
      return console.log(`Invalid directory: ${dirname} does not exist`)
    }
    checkFileExists(argv)
  })
}

//------------------------------------------------------------------------------
// Check if the file already exists

const checkFileExists = (argv) => {
  fs.access(argv.path, (err) => {
    if (err) return fetchPage(argv)
    askOverwriteOrNot(argv)
  })
}

//------------------------------------------------------------------------------
// Ask whether to overwrite or not

const askOverwriteOrNot = (argv) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('The file already exists. Overwrite? (y/n):  ', (answer) => {
    answer = answer.toLowerCase()
    if (answer === 'y' || answer === 'yes') {
      console.log('Overwriting')
      fetchPage(argv)
    } else {
      console.log('Cancelling')
    }
    rl.close()
  })
}

//------------------------------------------------------------------------------
// Fetch the page

const fetchPage = (argv) => {
  request(argv.url, (error, response, body) => {
    if (error) return console.log('error:', error)
    argv.data = body
    writeFile(argv)
  })
}

//------------------------------------------------------------------------------
// Write the data to a file

const writeFile = (argv) => {
  fs.writeFile(argv.path, argv.data, (error) => {
    if (error) return console.log('error:', error)
    console.log(
      `Downloaded and saved ${argv.data.length} bytes to ${argv.path}`
    )
    readline
  })
}

const argv = readArguments()
checkPathIsValid(argv)
