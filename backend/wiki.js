const https = require('https');
const wiki_random_url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
const wiki_request_url = 'https://en.wikipedia.org/api/rest_v1/page'

module.exports.getRandomWiki = function () {
  return new Promise(function (Resolve, Reject) {

    try {
      https.get(wiki_random_url, (res_rdm) => {
        res_rdm.on('data', (chunk) => {
        });

        res_rdm.on('end', () => {

          let url = wiki_request_url + (res_rdm.headers.location.toString().slice(2));
          console.log('Request: ' + url);

          https.get(url, (res_query) => {
            var json = '';

            res_query.on('data', function (chunk) {
              json += chunk;
            });

            res_query.on('end', () => {

              try {
                var data = JSON.parse(json);
                Resolve(data);
              } catch (err) {
                Reject(err);
              }

            }).on("error", (err) => {
              Reject(err);
            });
          });
        }).on("error", (err) => {
          Reject(err);
        });
      });
    } catch (err) {
      Reject(err);
    }
  });
}