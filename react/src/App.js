
import React, { Component } from 'react'
import { Button, Grid, Header, List, Segment, Breadcrumb } from 'semantic-ui-react'

import PropTypes from 'prop-types'
import { CustomMessage, Navbar, TableView } from 'components'
import 'styling/semantic.less'

import mixpanel from 'mixpanel-browser';

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

class App extends Component {


  componentDidMount() {
    console.log(this.context)
    mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);
    mixpanel.track("react", {
      lang: "en"
    })
  }

  render()
  {
    return (<Navbar leftItems={leftItems} rightItems={rightItems}>
        <br></br>
        <Segment>
          <Header as='h1'>David Siaw</Header>
          <h3>Software Engineer</h3>
          Tokyo, Japan
          <br />
        </Segment>
        <Segment>
          <Header as='h2'>Work experience</Header>
          <Grid>
            <Grid.Column computer={16} mobile={16}>
              <TableView 
                top_column_list={["company", "position", "start_date"]}></TableView>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment>
          <Header as='h2'>Personal projects</Header>
          <Grid>
            <Grid.Column computer={16} mobile={16}>
              <TableView 
                top_column_list={["name", "description", "url"]}
                source="personal_projects.yml"
                ></TableView>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment>
          <Header as='h2'>Education</Header>
          <Grid>
            <Grid.Column computer={16} mobile={16}>
              <TableView 
                top_column_list={["education", "start_year"]}
                source="education.yml"
                ></TableView>
            </Grid.Column>
          </Grid>
        </Segment>
        <br></br>
      </Navbar>
    )
  }

}

export default App
