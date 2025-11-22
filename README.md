# poso
cli rest client compatible with [vscode-restclient](https://github.com/Huachao/vscode-restclient)

## TODO
- [x] Request method
    - [x] Apply Variables
    - [ ] Default to GET if no method but URL
- [ ] Parse HTTP File
    - [ ] Sections
    - [ ] Named Request

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
