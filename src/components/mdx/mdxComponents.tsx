import type { MDXComponents } from 'mdx/types'
import { Callout } from './Callout'
import { MDXImage } from './MDXImage'

export const mdxComponents: MDXComponents = {
  Callout,
  img: MDXImage,
}
