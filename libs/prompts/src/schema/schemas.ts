import * as fromPrompts from '../prompts'
import { SchemaNode } from '../types'


export const schemas: SchemaNode[] = [{
  key: 'title',
  name: 'Title prompt',
  description: 'A prompt for generating short engaging titles.',
  templates: [{
    key: 'prompt',
    name: 'Prompt Template',
    path: 'templates/titles/title.v02.txt',
  }],
  texts: [{
    key: '01-sitc-james-tour-summary',
    name: '01 - Socrates In The City - Dr James Tour (summarized)',
    filepath: 'text/summary/summary.v02.txt',
    latest: true,
  }],
  createExecutor: () => fromPrompts.generateTitle,
}, {
  key: 'description',
  name: 'Description prompt',
  description: 'A prompt for generating a short description.',
  templates: [{
    key: 'prompt',
    name: 'Prompt Template',
    path: 'templates/descriptions/description.v01.txt'
  }],
  texts: [{
    key: '01-sitc-james-tour-summary',
    name: '01 - Socrates In The City - Dr James Tour (summarized)',
    filepath: 'text/summary/summary.v02.txt',
    latest: true,
  }],
  createExecutor: () => fromPrompts.generateDescription,
}, {
  key: 'categories',
  name: 'Category prompt',
  description: 'A prompt for generating a category and sub-category.',
  templates: [{
    key: 'prompt',
    name: 'Prompt Template',
    path: 'templates/categories/categorize.v01.txt'
  }],
  texts: [{
    key: '01-sitc-james-tour-summary',
    name: '01 - Socrates In The City - Dr James Tour (summarized)',
    filepath: 'text/summary/summary.v02.txt',
    latest: true,
  }],
  createExecutor: () => fromPrompts.generateCategories,
}, {
  key: 'hashtags',
  name: 'Hashtags prompt',
  description: 'A prompt for generating a hashtags.',
  templates: [{
    key: 'prompt',
    name: 'Prompt Template',
    path: 'templates/social-hashtags/social-hashtags.v01.txt'
  }],
  texts: [{
    key: '01-sitc-james-tour-summary',
    name: '01 - Socrates In The City - Dr James Tour (summarized)',
    filepath: 'text/summary/summary.v02.txt',
    latest: true,
  }],
  createExecutor: () => fromPrompts.generateHashtags,
}, {
  key: 'ratings',
  name: 'Ratings prompt',
  description: 'A prompt for generating ratings.',
  templates: [{
    key: 'prompt',
    name: 'Prompt Template',
    path: 'templates/ratings/ratings-moderator.v01.txt'
  }],
  texts: [{
    key: '01-sitc-james-tour-summary',
    name: '01 - Socrates In The City - Dr James Tour (summarized)',
    filepath: 'text/summary/summary.v02.txt',
    latest: true,
  }],
  createExecutor: () => fromPrompts.generateRatings,
}, {
  key: 'poster',
  name: 'Poster prompt',
  description: 'A prompt for generating an image poster prompt.',
  templates: [{
    key: 'prompt',
    name: 'Prompt Template',
    path: 'templates/image-poster/image-poster.v01.txt'
  }],
  texts: [{
    key: '01-sitc-james-tour-summary',
    name: '01 - Socrates In The City - Dr James Tour (summarized)',
    filepath: 'text/summary/summary.v02.txt',
    latest: true,
  }],
  createExecutor: () => fromPrompts.generateRatings,
}, {
  key: 'summarize',
  name: 'Summarize prompt',
  description: 'A prompt for generating a summary from a large document.',
  templates: [{
    key: 'promptCombine',
    name: 'Combine Prompt Template',
    path: 'templates/summaries/summary-combine.v01.txt'
  }, {
    key: 'promptSummize',
    name: 'Summerize Prompt Template',
    path: 'templates/summaries/summary-summize.v02.txt'
  }],
  texts: [{
    key: '01-sitc-james-tour-plaintext',
    name: '01 - Socrates In The City - Dr James Tour (plain text)',
    filepath: 'text/transcript/transcript-text.v01.txt',
    latest: true,
  }, {
    key: '02-sitc-james-tour-stamped-text',
    name: '02 - Socrates In The City - Dr James Tour (stamped text)',
    filepath: 'text/transcript/transcript-text-stamped.v02.txt',
    latest: true,
  }],
  createExecutor: () => fromPrompts.generateSummary,
}, {
  key: 'map-mixed',
  name: 'Map mixed prompt',
  description: 'A prompt for generating a mixed result set over a mapped file set.',
  output: 'json',
  templates: [{
    key: 'prompt',
    name: 'Prompt Template',
    path: 'templates/map-mixed/map-mixed.v02.txt'
  }],
  texts: [{
    key: '01-sitc-james-tour-transcript',
    name: '01 - Socrates In The City - Dr James Tour (snapshot stamped)',
    filepath: 'text/transcript/transcript-snapshot-stamped.v02.txt',
    latest: true,
  }],
  createExecutor: () => fromPrompts.generateMapMixed,
}, {
  key: 'article',
  name: 'Article prompt',
  description: 'A prompt for converting a transcript into an article.',
  templates: [{
    key: 'prompt',
    name: 'Prompt Template',
    path: 'templates/article/article.v01.txt',
  }],
  texts: [{
    key: '01-sitc-james-tour-transcript',
    name: '01 - Socrates In The City - Dr James Tour (stamped)',
    filepath: 'text/transcript/transcript-text-stamped.v02.txt',
    latest: true,
  }],
  createExecutor: () => fromPrompts.generateArticle,
}]
