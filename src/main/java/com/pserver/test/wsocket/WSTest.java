package com.pserver.test.wsocket;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/wsocket")
public class WSTest 
{

	private String myMessage = " ";
	private int    counter   =  0 ;
	
	private ArrayList<Session> sessions = new ArrayList<Session>();
	
	@OnMessage
    public void onMessage(String message, Session session) throws IOException, InterruptedException 
	{
/**
		myMessage = message;
        return myMessage + ":" + counter++;      
*/
	    // Send the first message to the client
	    session.getBasicRemote().sendText("This is the first server message (wait)");
	  
	    // Send 3 messages to the client every 5 seconds
	    int sentMessages = 0;
	    while(sentMessages < 3){
	      Thread.sleep(5000);
	      session.getBasicRemote().
	        sendText("This is an intermediate server message. Count: " + sentMessages + " (wait)");
	      sentMessages++;
	    }
	  
	    // Send a final message to the client
	    session.getBasicRemote().sendText("This is the last server message. (END)");

	}

	

}


