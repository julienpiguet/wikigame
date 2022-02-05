const https = require('https');
const prefix_url = 'https://'
const base_wiki_url = 'wikipedia.org'
const wiki_random_path = '/api/rest_v1/page/random/summary';
const wiki_request_path = '/api/rest_v1/page'

module.exports.getRandomWiki = function (lang = 'en') {
  return new Promise(function (Resolve, Reject) {
    let rdm_url = prefix_url+lang+'.'+base_wiki_url+wiki_random_path;
    console.log('Request: ' + rdm_url);
    https.get(rdm_url, (res_rdm) => {
      res_rdm.on('data', (chunk) => {
      });

      res_rdm.on('end', () => {

        let url = prefix_url+lang+'.'+base_wiki_url+wiki_request_path + (res_rdm.headers.location.toString().slice(2));
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
        }).on("error", (err) => {
          Reject(err);
        });
      }).on("error", (err) => {
        Reject(err);
      });
    }).on("error", (err) => {
      Reject(err);
    });
  });
}