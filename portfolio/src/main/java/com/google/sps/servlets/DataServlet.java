// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/comments")
public class DataServlet extends HttpServlet {
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  private final class Comment {
    private final String user;
    private final String message;

    public Comment(String user, String message) {
      this.user = user;
      this.message = message;
    }
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Comment");
    int numComents = 1;
    try {
      numComents = Integer.parseInt(request.getParameter("numComments"));
    } catch (Exception e) {}

    List<Entity> results = datastore.prepare(query).asList(FetchOptions.Builder.withLimit(numComents));
    ArrayList<Comment> comments = new ArrayList();

    for (Entity entity : results) {
      String comment = (String) entity.getProperty("message");
      String user = (String) entity.getProperty("name");
      comments.add(new Comment(user, comment));
    }

    Gson gson = new Gson();
    String json = gson.toJson(comments);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
      .setAudience(Collections.singletonList("813751014340-ht5ugfu1pqj5a4gqq7rbvjk0sffu00it.apps.googleusercontent.com")).build();
    GoogleIdToken idToken = null;     
    String key = request.getParameter("idtoken");
    
    try {
      idToken = verifier.verify(key);
    } catch (Exception e) {
      // exception thrown if verifier.verify does not succeed
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Verification Failed: " + e.getMessage());
      return;
    }
    Payload payload = idToken.getPayload();
    String name = (String) payload.get("name");
    String pictureURL = (String) payload.get("picture");
    String comment = request.getParameter("comment");

    if (comment == null) {
      response.sendRedirect("/index.html");
      return;  
    }

    Entity commentEntity = new Entity("Comment"); 
    commentEntity.setProperty("message", comment);
    commentEntity.setProperty("name", name);   
    commentEntity.setProperty("picture", pictureURL);

    datastore.put(commentEntity); 
    response.sendRedirect("/index.html");
  }
}
