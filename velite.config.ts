import { defineConfig } from 'velite'

export default defineConfig({
  root: '.',
  output: {
    data: '.velite/generated'
  },
  collections: {
    pages: {
      pattern: 'content/**/*.mdx',
      schema: {
        title: 'string',
        description: 'string?',
        body: 'mdx'
      }
    }
  }
})
