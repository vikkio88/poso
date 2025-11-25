# poso
CLI REST client compatible with [vscode-restclient](https://github.com/Huachao/vscode-restclient)

```bash
npm i -g poso
```

### Request flags

- `--stop-on-http-error` Stop when the response status is not 2xx
- `--show-headers`       Show the response headers
- `--status-only`        Print only the response status
- `--silent`             Reduce verbosity.
- `--json`               Parse the response and print it as json string.

## Execute a request

```bash
poso r "GET {{url}}/todos/{{id}}" "@id=2 @url=https://jsonplaceholder.typicode.com"
```
## Open a file

Parse a `.http` file and select a request interactively:

```bash
poso open ./file.http
```

Add override variables and select a specific request:

```bash
poso o ./file.http "@id=OVERRIDE_ID" --request-name="Get One"
```

Just show a list of the requests in a file
```bash
poso o ./file.http --list
```



## TODO
- [x] Request method
    - [x] Apply Variables
    - [ ] Default to GET if no method but URL
- [ ] Parse HTTP File
    - [x] Sections
    - [ ] Named Request
        - [x] named after section divider
        - [ ] named var `@name`
- [ ] Request parser does not apply vars until exec

- [ ] Variables
    - [ ] Recursive Variables
        ```
        @website=thing.com
        @apiUrl=http://{{website}}/api
        ```

### Maybe TODOs
- [ ] Calculated Vars coming from named Request
    ```
    @id={{create.response.body.json.id}}
    
    get {{apiUrl}}/users/@id
    ```
