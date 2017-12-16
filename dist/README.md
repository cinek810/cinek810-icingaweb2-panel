## Icinga web 2 Panel Plugin for Grafana


The Icinga web2 Panel Plugin gets data from icinga web2 interface and present selected services (for instance criticals or unhandled criticals) in a form of HTML table on grafana dashboard. Plugin allows to list services based on service status and acknowledgement connecting to icinga web2 API. 

Connection to API requires external authentications [1] to be enabled in icinga web2. The user configured in plugin options tab needs privileges to read from `monitoring/list/services` icinga web2 endpoint. Remember that this user _password_ will be stored in grafana dashboard JSON and will be visible to everyone who has access to grafana dashboard - proper access limiting may be important. Current version of the plugin connects directly to icinga web2, which requires appropiate CORS implementation on icinga web2 server side - unfortunately this is not something one can configure in icinga web2 directly. It requires icinga web2 front server modifications.

### Nginx based implementation of CORS needed for the plugin
We assume that grafana is running under grafana.mydomain address, the full configuration of icinga web2 front nginx server will look like 
```
server {
  listen *:443 ssl;
  server_name hpc-icinga.europe.delphiauto.net;

  root /usr/share/icingaweb2/public; #Path of icinga2 web directory
  index index.php;
  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;

  ssl_certificate icinga.pem;
  ssl_certificate_key icinga.key;
  ssl_ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS;
  ssl_prefer_server_ciphers on;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_session_timeout 5m;

  auth_basic "Restricted";
  auth_basic_user_file /etc/icingaweb2/.http-users;


  location = /favicon.ico {
    log_not_found off;
    access_log off;
    expires max;
  }

  location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
  }

  location ~ \..*/.*\.php$ {
    return 403;
  }

  if (!-d $request_filename) {
    rewrite ^/(.+)/$ /$1 permanent;
  }

  location / {
	  if ( $request_method = OPTIONS )
	  {
		add_header 'Access-Control-Allow-Origin' 'https://grafana.mydomain' always;
        	add_header 'Access-Control-Allow-Methods' 'GET' always;
        	add_header 'Access-Control-Allow-Headers' "Authorization" always;

		add_header 'Content-Length' 0 always;
		return 200;
	  }

    try_files $1 $uri $uri/ /index.php$is_args$args;

  }

  location ~ ^/index\.php(.*)$ {

        add_header 'Access-Control-Allow-Origin' 'https://grafana.mydomain' always;
        add_header 'Access-Control-Allow-Methods' 'GET' always;
        add_header 'Access-Control-Allow-Headers' "Authorization" always;


    fastcgi_index index.php;
    include /etc/nginx/fastcgi_params;
    try_files $uri =404;
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_read_timeout 300;

    fastcgi_pass unix:/var/run/php5-fpm.sock; #Replace with the port if php fpm is configured to run on port.
    fastcgi_param SCRIPT_FILENAME /usr/share/icingaweb2/public/index.php; #Replace with icinga2 web index.php file path.
    fastcgi_param ICINGAWEB_CONFIGDIR /etc/icingaweb2;
    fastcgi_param REMOTE_USER $remote_user;
  }
}


```
the lines of special interest for us are
1) Simple http authentication, required by icinga web2 external authentication mechanism
```
auth_basic "Restricted";
auth_basic_user_file /etc/icingaweb2/.http-users;
```

2) CORS rules implementation OPTIONS http method handling and appropriate `add_headers` directives.



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
