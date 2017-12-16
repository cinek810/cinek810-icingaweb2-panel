## Icinga web 2 Panel Plugin for Grafana


The Icinga web2 Panel Plugin gets data from icinga web2 interface and present selected services (for instance criticals or unhandled criticals) in a form of HTML table on grafana dashboard. Plugin allows to list services based on service status and acknowledgement connecting to icinga web2 API. 

Connection to API requires external authentications [1] to be enabled in icinga web2. The user configured in plugin options tab needs privileges to read from `monitoring/list/services` icinga web2 endpoint. Current version of the plugin connects directly to icinga web2, which requires appropiate CORS implementation on icinga web2 server side - unfortunately this is not something one can configure in icinga web2 directly - it requires icinga web2 front server modifications.

### Nginx based implementation of CORS needed for the plugin
We assume that grafana is running under grafana.mydomain address, the full configuration of icinga web2 front nginx server will look like 
```
```
the lines of special interest for us are
1) Simple http authentication, required by icinga web2 external authentication mechanism
```
```

2) CORS rules implementation - handling for OPTIONS http method and appropriate `add_headers` directives.



You can check my blog posts describing a little bit sercuity details of this approach [2][3], [3][2].

[1]: https://www.icinga.com/docs/icingaweb2/latest/doc/05-Authentication/#external-authentication
[2]: https://funinit.wordpress.com/2017/12/07/icinga-web2-and-grafana-working-together/
[3]: https://funinit.wordpress.com/2017/08/29/integrating-grafana-with-icinga2/


## Screenshots 
![Current view of options tab](https://github.com/cinek810/icingaweb2-panel/raw/master/src/img/editorTab.png)
![List of services in pane](https://github.com/cinek810/icingaweb2-panel/raw/master/src/img/servicesList.png)


## Changelog

### v0.0.3
- Additional instructions on nginx configuration

### v0.0.2

- Options tab in edit mode. Select services status, acknowledgement from the options tab. 
- Basic information in README.md, screenshots 

### v0.0.1

- Initial version of the plugin. List critical services
