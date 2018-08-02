import React from 'react'
import { Button, Grid, Header, List, Segment, Breadcrumb } from 'semantic-ui-react'

import { CustomMessage, Navbar, TableView } from 'components'
import 'styling/semantic.less'


const leftItems = [
  {
    as: 'a',
    content: 'Original Resume',
    href: 'https://resume.davidsiaw.net/',
    icon: 'book',
    key: 'docs',
    target: '_blank',
  },
]
const rightItems = [
  {
    as: 'a',
    content: 'Github',
    href: 'https://github.com/davidsiaw',
    icon: 'github',
    key: 'github',
    target: '_blank',
  }
]

const App = () => (
  <Navbar leftItems={leftItems} rightItems={rightItems}>
    <Segment>
      <Header as='h1'>David Siaw</Header>
      <hr />
      <h3>Software Engineer</h3>
      Tokyo, Japan
      <br />
      <Breadcrumb>
        <Breadcrumb.Section link>devops</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section link>fullstack</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>native</Breadcrumb.Section>
      </Breadcrumb>
    </Segment>
    <Segment>
      <Header as='h2'>Work experience</Header>
      <Grid>
        <Grid.Column computer={16} mobile={16}>
          <TableView></TableView>
        </Grid.Column>
      </Grid>
    </Segment>
  </Navbar>
)

export default App
