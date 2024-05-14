const express = require('express')
const axios = require("axios");
const app = express()
const HttpsProxyAgent = require('https-proxy-agent').HttpsProxyAgent;



function Fheaders(username){
	let headerkeyclass = {
		"x-client-uuid":1,
		"x-csrf-token":1,
		"accept":1,
		"accept-language":1,
		"user-agent":1,
		"x-twitter-active-user":1,
		"x-twitter-auth-type":1,
		"x-twitter-client-language":1,
		"authorization":1,
		"x-client-transaction-id":1,
		"cookie":1,
		"content-type":1,
	}
	let headers_ = require("./config/heades.js").split("\n");
	let _headers = {}
	for(let index in headers_){
		let headerkv = headers_[index].split(":");
		let k = headerkv[0];
		let v = headerkv[1];
		
		if(headerkeyclass[k.toLowerCase()]){
			_headers[k] = v;
		}
	}
	
	_headers["referer"] = ` https://twitter.com/${username}`
	return  _headers;
}

async function GetUserByScreenName(username){
  let url = `https://twitter.com/i/api/graphql/qW5u-DAuXpMEG0zA1F7UGQ/UserByScreenName?variables=%7B%22screen_name%22%3A%22${username}%22%2C%22withSafetyModeUserFields%22%3Atrue%7D&features=%7B%22hidden_profile_likes_enabled%22%3Atrue%2C%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Afalse%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Afalse%7D`;
  
  const headers = Fheaders(username);
  const agent = new HttpsProxyAgent('http://0ab80667:54678428@64.64.238.128:8000');

  try {
    let res = await axios.get(url, {
      headers:headers,
      httpAgent: agent, httpsAgent: agent
    });
    if(res.data.data.user == undefined){
      return "接口无返回值 检查用户名是否存在" ;
    }
    return `${username} ---- ${res.data.data.user.result.has_graduated_access}`;
  } catch (error) {
    console.log(error)
    return "报错了:"+error
  }
}

app.get('/UserByScreenName', async function  (req, res) {

	if(req.query != null)
	{
		username = req.query["id"];
	}
	if(username){
    res.send(await GetUserByScreenName(username));
    return;
	}
	//返回数据给客户端
  res.send('?id=')
})

app.listen(3000)