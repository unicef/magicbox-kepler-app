# Build process must be executed before to build using this Dockerfile, to build the code use: $ npm run build. 
# Don't forget to check config and token folders fisrt for changing configuration vars.
FROM nginx:alpine

COPY dist /usr/share/nginx/html
COPY public /usr/share/nginx/html
COPY index.html main.css /usr/share/nginx/html/