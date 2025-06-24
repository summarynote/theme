import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Highlight from '@site/src/components/Highlight';
import {Row, Column} from '@site/src/components/Column';
import Slideshow from '@site/src/components/Slideshow';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Map the "<Highlight>" tag to our Highlight component
  // `Highlight` will receive all props that were passed to `<Highlight>` in MDX
  Tabs,
  TabItem,
  CodeBlock,
  Highlight,
  Row,
  Column,
  Slideshow,
};