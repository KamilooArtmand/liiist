module.exports = {
  apps: [{ name: 'liiist', script: 'npx', args: 'wrangler dev --port 8787 --ip 0.0.0.0', cwd: __dirname, env: { NODE_ENV: 'development' } }],
}
