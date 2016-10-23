// RocketIO.js v0.3.2 (websocketio:v0.4.0, cometio:v0.5.9)
// https://github.com/shokai/sinatra-rocketio
// (c) 2013 Sho Hashimoto <hashimoto@shokai.org>
// The MIT License
var RocketIO = function(opts){
  new EventEmitter().apply(this);
  if (typeof opts === "undefined" || opts === null) {
    opts = {};
  }

  this.type = opts.type || null; // "comet" or "websocket"
  this.session = opts.session || null;
  this.ssl = opts.ssl || null;
  this.channel = null;

  if(typeof opts.channel !== "undefined" && opts.channel !== null){
    this.channel = ""+opts.channel;
  }

  var setting = {};
  var self = this;
  var ws_close_timer = null;

  this.io = null;

  self.on("__connect", function(session_id){
    self.session = session_id;
    self.io.push("__channel_id", self.channel);
    self.emit("connect");
  });

  this.connect = function(url){
    if(typeof url === "string"){
      $.getJSON(url+"/rocketio/settings", function(res){
        setting = res;
        connect_io();
      });
      return self;
    }
    else{
      return connect_io();
    }
  };

  var ssl_check = function(url) {
    return self.ssl ?
      url.replace('http', 'https') : url;
  }

  var connect_io = function(){
    self.io = (function(){
      if (self.type === "comet") return;
      if (typeof WebSocketIO !== "function") return;
      var io = new WebSocketIO();

      if (typeof setting.websocket === "string") {
        io.url = ssl_check(setting.websocket);
      }

      io.session = self.session;
      return io.connect();
    }()) || (function() {
      if (typeof CometIO !== "function") return;
      var io = new CometIO();

      if (typeof setting.comet === "string") {
        io.url = ssl_check(setting.comet);
      }

      io.session = self.session;
      return io.connect();
    })();

    if(typeof self.io === "undefined"){
      setTimeout(function(){
        self.emit("error", "WebSocketIO and CometIO are not available");
      }, 100);
      return self;
    };
    if(self.io.url.match(/^ws:\/\/.+/)) self.type = "websocket";
    else if(self.io.url.match(/cometio/)) self.type = "comet";
    else self.type = "unknown";
    self.io.on("*", function(event_name, args){
      if(event_name === "connect") event_name = "__connect";
      self.emit(event_name, args);
    });
    ws_close_timer = setTimeout(function(){
      self.close();
      self.type = "comet";
      connect_io();
    }, 3000);
    self.once("connect", function(){
      if(ws_close_timer) clearTimeout(ws_close_timer);
      ws_close_timer = null;
    });
    return self;
  };

  this.close = function(){
    self.io.close();
  };

  this.push = function(type, data){
    self.io.push(type, data);
  };
};

var CometIO = function(url, opts){
  new EventEmitter().apply(this);
  if(typeof opts === "undefined" || opts === null) opts = {};
  this.url = url || "";
  this.session = opts.session || null;

  var running = false;
  var self = this;
  var post_queue = [];

  var flush = function(){
    if(!running || post_queue.length < 1) return;
    var post_data = {
      json: JSON.stringify({
        session: self.session,
        events: post_queue
      })
    };
    $.ajax(
      {
        url : self.url,
        data : post_data,
        success : function(data){
        },
        error : function(req, stat, e){
          self.emit("error", "CometIO push error");
        },
        complete : function(e){
        },
        type : "POST",
        dataType : "json",
        timeout : 10000
      }
    );
    post_queue = [];
  };
  setInterval(flush, 1000);

  this.push = function(type, data){
    if(!running || !self.session){
      self.emit("error", "CometIO not connected");
      return;
    }
    post_queue.push({type: type, data: data})
  };

  this.connect = function(){
    if(running) return self;
    self.on("__session_id", function(session){
      self.session = session;
      self.emit("connect", self.session);
    });
    running = true;
    get();
    return self;
  };

  this.close = function(){
    running = false;
    self.removeListener("__session_id");
  };

  var get = function(){
    if(!running) return;
    $.ajax(
      {
        url : self.url+"?"+(new Date()-0),
        data : {session : self.session},
        success : function(data_arr){
          if(data_arr !== null && typeof data_arr == "object" && !!data_arr.length){
            for(var i = 0; i < data_arr.length; i++){
              var data = data_arr[i];
              if(data) self.emit(data.type, data.data);
            }
          }
          get();
        },
        error : function(req, stat, e){
          self.emit("error", "CometIO get error");
          setTimeout(get, 10000);
        },
        complete : function(e){
        },
        type : "GET",
        dataType : "json",
        timeout : 130000
      }
    );
  };
};

var WebSocketIO = function(url, opts){
  new EventEmitter().apply(this);
  if(typeof opts === "undefined" || opts === null) opts = {};
  this.url = url || "";
  this.session = opts.session || null;
  this.websocket = null;
  this.connecting = false;
  var reconnect_timer_id = null;
  var running = false;
  var self = this;

  self.on("__session_id", function(session_id){
    self.session = session_id;
    self.emit("connect", self.session);
  });

  this.connect = function(){
    if(typeof WebSocket === "undefined"){
      self.emit("error", "websocket not exists in this browser");
      return null;
    }
    self.running = true;
    var url = self.session ? self.url+"/session="+self.session : self.url;
    self.websocket = new WebSocket(url);
    self.websocket.onmessage = function(e){
      var data_ = null;
      try{
        data_ = JSON.parse(e.data);
      }
      catch(e){
        self.emit("error", "WebSocketIO data parse error");
      }
      if(!!data_) self.emit(data_.type, data_.data);
    };
    self.websocket.onclose = function(){
      if(self.connecting){
        self.connecting = false;
        self.emit("disconnect");
      }
      if(self.running){
        reconnect_timer_id = setTimeout(self.connect, 10000);
      }
    };
    self.websocket.onopen = function(){
      self.connecting = true;
    };
    return self;
  };

  this.close = function(){
    clearTimeout(reconnect_timer_id);
    self.running = false;
    self.websocket.close();
  };

  this.push = function(type, data){
    if(!self.connecting){
      self.emit("error", "websocket not connected");
      return;
    }
    self.websocket.send(JSON.stringify({type: type, data: data, session: self.session}));
  };
};

// event_emitter.js v0.0.8
// https://github.com/shokai/event_emitter.js
// (c) 2013 Sho Hashimoto <hashimoto@shokai.org>
// The MIT License
var EventEmitter = function(){
  var self = this;
  this.apply = function(target, prefix){
    if(!prefix) prefix = "";
    for(var func in self){
      if(self.hasOwnProperty(func) && func !== "apply"){
        target[prefix+func] = this[func];
      }
    }
  };
  this.__events = new Array();
  this.on = function(type, listener, opts){
    if(typeof listener !== "function") return;
    var event_id = self.__events.length > 0 ? 1 + self.__events[self.__events.length-1].id : 0
    var params = {
      id: event_id,
      type: type,
      listener: listener
    };
    for(i in opts){
      if(!params[i]) params[i] = opts[i];
    };
    self.__events.push(params);
    return event_id;
  };

  this.once = function(type, listener){
    self.on(type, listener, {once: true});
  };

  this.emit = function(type, data){
    for(var i = 0; i < self.__events.length; i++){
      var e = self.__events[i];
      switch(e.type){
      case type:
        e.listener(data);
        if(e.once) e.type = null;
        break
      case "*":
        e.listener(type, data);
        if(e.once) e.type = null;
        break
      }
    }
    self.removeListener();
  };

  this.removeListener = function(id_or_type){
    for(var i = self.__events.length-1; i >= 0; i--){
      var e = self.__events[i];
      switch(typeof id_or_type){
      case "number":
        if(e.id === id_or_type) self.__events.splice(i,1);
        break
      case "string":
      case "object":
        if(e.type === id_or_type) self.__events.splice(i,1);
        break
      }
    }
  };

};

if(typeof module !== "undefined" && typeof module.exports !== "undefined"){
  // module.exports = EventEmitter;
  module.exports = RocketIO;
}

