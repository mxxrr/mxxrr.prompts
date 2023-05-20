/**
 * This file sets you up with structure needed for an ESLint rule.
 *
 * It leverages utilities from @typescript-eslint to allow TypeScript to
 * provide autocompletions etc for the configuration.
 *
 * Your rule's custom logic will live within the create() method below
 * and you can learn more about writing ESLint rules on the official guide:
 *
 * https://eslint.org/docs/developer-guide/working-with-rules
 *
 * You can also view many examples of existing rules here:
 *
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules
 */

/**
 * This rule has been forked from - https://github.com/eslint/eslint/blob/main/lib/rules/space-in-parens.js
 */
import { ASTUtils, ESLintUtils } from '@typescript-eslint/utils'


interface Options {
  braceException?: boolean
  bracketException?: boolean
  parenException?: boolean
  empty?: boolean
  banger?: boolean
}
// NOTE: The rule will be available in ESLint configs as "@nrwl/nx/workspace/space-in-parens"
export const RULE_NAME = 'space-in-parens'

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing inside parentheses',
      recommended: false,
    },
    fixable: 'whitespace',
    schema: [
      {
        enum: ['always', 'never'],
      },
      {
        type: 'object',
        properties: {
          exceptions: {
            type: 'array',
            items: {
              enum: ['{}', '[]', '()', 'empty', '!'],
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingOpeningSpace: 'There must be a space after this paren.',
      missingClosingSpace: 'There must be a space before this paren.',
      rejectedOpeningSpace: 'There should be no space after this paren.',
      rejectedClosingSpace: 'There should be no space before this paren.',
    },
  },
  defaultOptions: [],
  create (context) {
    const ALWAYS = context.options[0] === 'always'
    const exceptionsArrayOptions = (context.options[1] && context.options[1].exceptions) || []
    const options: Options = {}

    let exceptions

    if (exceptionsArrayOptions.length) {
      options.braceException = exceptionsArrayOptions.includes('{}')
      options.bracketException = exceptionsArrayOptions.includes('[]')
      options.parenException = exceptionsArrayOptions.includes('()')
      options.empty = exceptionsArrayOptions.includes('empty')
      options.banger = exceptionsArrayOptions.includes('!')
    }

    /**
     * Produces an object with the opener and closer exception values
     * @returns {Object} `openers` and `closers` exception values
     * @private
     */
    function getExceptions () {
      const openers = []
      const closers = []

      if (options.braceException) {
        openers.push('{')
        closers.push('}')
      }

      if (options.bracketException) {
        openers.push('[')
        closers.push(']')
      }

      if (options.parenException) {
        openers.push('(')
        closers.push(')')
      }

      if (options.empty) {
        openers.push(')')
        closers.push('(')
      }

      if (options.banger) {
        openers.push('!')
      }

      return {
        openers,
        closers,
      }
    }

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------
    const sourceCode = context.getSourceCode()

    /**
     * Determines if a token is one of the exceptions for the opener paren
     * @param {Object} token The token to check
     * @returns {boolean} True if the token is one of the exceptions for the opener paren
     */
    function isOpenerException (token) {
      return exceptions.openers.includes(token.value)
    }

    /**
     * Determines if a token is one of the exceptions for the closer paren
     * @param {Object} token The token to check
     * @returns {boolean} True if the token is one of the exceptions for the closer paren
     */
    function isCloserException (token) {
      return exceptions.closers.includes(token.value)
    }

    /**
     * Determines if an opening paren is immediately followed by a required space
     * @param {Object} openingParenToken The paren token
     * @param {Object} tokenAfterOpeningParen The token after it
     * @returns {boolean} True if the opening paren is missing a required space
     */
    function openerMissingSpace (openingParenToken, tokenAfterOpeningParen) {
      if (sourceCode.isSpaceBetweenTokens(openingParenToken, tokenAfterOpeningParen)) {
        return false
      }

      if ( ! options.empty && ASTUtils.isClosingParenToken(tokenAfterOpeningParen)) {
        return false
      }

      if (ALWAYS) {
        return ! isOpenerException(tokenAfterOpeningParen)
      }

      return isOpenerException(tokenAfterOpeningParen)
    }

    /**
     * Determines if an opening paren is immediately followed by a disallowed space
     * @param {Object} openingParenToken The paren token
     * @param {Object} tokenAfterOpeningParen The token after it
     * @returns {boolean} True if the opening paren has a disallowed space
     */
    function openerRejectsSpace (openingParenToken, tokenAfterOpeningParen) {
      if ( ! ASTUtils.isTokenOnSameLine(openingParenToken, tokenAfterOpeningParen)) {
        return false
      }

      if (tokenAfterOpeningParen.type === 'Line') {
        return false
      }

      if ( ! sourceCode.isSpaceBetweenTokens(openingParenToken, tokenAfterOpeningParen)) {
        return false
      }

      if (ALWAYS) {
        return isOpenerException(tokenAfterOpeningParen)
      }

      return ! isOpenerException(tokenAfterOpeningParen)
    }

    /**
     * Determines if a closing paren is immediately preceded by a required space
     * @param {Object} tokenBeforeClosingParen The token before the paren
     * @param {Object} closingParenToken The paren token
     * @returns {boolean} True if the closing paren is missing a required space
     */
    function closerMissingSpace (tokenBeforeClosingParen, closingParenToken) {
      if (sourceCode.isSpaceBetweenTokens(tokenBeforeClosingParen, closingParenToken)) {
        return false
      }

      if ( ! options.empty && ASTUtils.isOpeningParenToken(tokenBeforeClosingParen)) {
        return false
      }

      if (ALWAYS) {
        return ! isCloserException(tokenBeforeClosingParen)
      }

      return isCloserException(tokenBeforeClosingParen)
    }

    /**
     * Determines if a closer paren is immediately preceded by a disallowed space
     * @param {Object} tokenBeforeClosingParen The token before the paren
     * @param {Object} closingParenToken The paren token
     * @returns {boolean} True if the closing paren has a disallowed space
     */
    function closerRejectsSpace (tokenBeforeClosingParen, closingParenToken) {
      if ( ! ASTUtils.isTokenOnSameLine(tokenBeforeClosingParen, closingParenToken)) {
        return false
      }

      if ( ! sourceCode.isSpaceBetweenTokens(tokenBeforeClosingParen, closingParenToken)) {
        return false
      }

      if (ALWAYS) {
        return isCloserException(tokenBeforeClosingParen)
      }

      return ! isCloserException(tokenBeforeClosingParen)
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
      Program: function checkParenSpaces (node) {
        exceptions = getExceptions()
        const tokens = sourceCode.tokensAndComments

        tokens.forEach((token, i) => {
          const prevToken = tokens[i - 1]
          const nextToken = tokens[i + 1]

          // if token is not an opening or closing paren token, do nothing
          if ( ! ASTUtils.isOpeningParenToken(token) && ! ASTUtils.isClosingParenToken(token)) {
            return
          }

          // if token is an opening paren and is not followed by a required space
          if (token.value === '(' && openerMissingSpace(token, nextToken)) {
            context.report({
              node,
              loc: token.loc,
              messageId: 'missingOpeningSpace',
              fix (fixer) {
                return fixer.insertTextAfter(token, ' ')
              },
            })
          }

          // if token is an opening paren and is followed by a disallowed space
          if (token.value === '(' && openerRejectsSpace(token, nextToken)) {
            context.report({
              node,
              loc: {
                start: token.loc.end, end: nextToken.loc.start,
              },
              messageId: 'rejectedOpeningSpace',
              fix (fixer) {
                return fixer.removeRange([token.range[1], nextToken.range[0]])
              },
            })
          }

          // if token is a closing paren and is not preceded by a required space
          if (token.value === ')' && closerMissingSpace(prevToken, token)) {
            context.report({
              node,
              loc: token.loc,
              messageId: 'missingClosingSpace',
              fix (fixer) {
                return fixer.insertTextBefore(token, ' ')
              },
            })
          }

          // if token is a closing paren and is preceded by a disallowed space
          if (token.value === ')' && closerRejectsSpace(prevToken, token)) {
            context.report({
              node,
              loc: {
                start: prevToken.loc.end, end: token.loc.start,
              },
              messageId: 'rejectedClosingSpace',
              fix (fixer) {
                return fixer.removeRange([prevToken.range[1], token.range[0]])
              },
            })
          }
        })
      },
    }
  },
})
