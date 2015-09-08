package com.pserver.test.wsocket;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

;

public class WSTestServlet extends HttpServlet{
		
		private static int counter = 0;
	
		public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException{
			PrintWriter out = response.getWriter();
			out.println("<html>");
			out.println("<body>");
			out.println("<h1>Hello Servlet Get "+counter+++"</h1>");
			out.println("</body>");
			out.println("</html>");	
		}
	
}
