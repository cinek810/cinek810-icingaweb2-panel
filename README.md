## Icinga web 2 Panel Plugin for Grafana

The Icinga web2 Panel Plugin gets data from icinga web2 interface and present selected services (for instance criticals or unhandled criticals) in a form of HTML table on grafana dashboard.

### Options

- **Status**:

  Plugin allows to list set of services based on service status and acknowledgement connecting icinga web2 API. Connection to API requires external authentications [1] to be enabled in icinga web2. 

[1] https://www.icinga.com/docs/icingaweb2/latest/doc/05-Authentication/#external-authentication


#### Changelog

##### v0.0.2

- Options tab in edit mode. Select services status, acknowledgement from the options tab. 

##### v0.0.1

- Initial version of the plugin. List critical services
