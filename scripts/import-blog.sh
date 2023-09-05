#!/bin/bash

page=1;
while [ 1 == 1 ]
do
  posts=$(https "https://blog.barradoce.com.br/wp-json/wp/v2/posts?page=$page");
  echo "";
  echo $page;
  for row in $(echo "${posts}" | jq -r '.[] | @base64'); do
    _jq() {
      echo ${row} | base64 --decode | jq -r ${1};
    }
    slug=$(_jq '.slug');
    [ -z "$slug" ] && exit 0;
    date=$(_jq '.date_gmt');
    title=$(_jq '.title.rendered');
    content=$(_jq '.content.rendered');
    content=${content/"https://blog.barradoce.com.br/"/"https://www.barradoce.com.br/posts/"};
    description=$(_jq '.excerpt.rendered');
    thumbnail_src=$(_jq '.jetpack_featured_media_url');
    if [ ! -z "$thumbnail_src" ]; then
      curl $thumbnail_src > "template/public/img/uploads/$slug.webp";
      thumbnail="/img/uploads/$slug.webp";
    else
      thumbnail="";
    fi
    cat > "content/posts/$slug.json" << EOL
{
  "title": "$title",
  "date": "${date}Z",
  "thumbnail": "$thumbnail",
  "description": $(echo $content | jq -Rs .),
  "body": $(echo $content | jq -Rs .),
  "meta_title": "",
  "meta_description": $(echo $content | jq -R .)
}
EOL
  done
  page=$((page+1));
done
