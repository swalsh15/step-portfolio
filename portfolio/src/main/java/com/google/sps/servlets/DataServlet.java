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
    int numComents = Integer.parseInt(request.getParameter("numComments"));
    List<Entity> results = datastore.prepare(query).asList(FetchOptions.Builder.withLimit(numComents));
    ArrayList<Comment> comments = new ArrayList();

    for (Entity entity : results) {
      String comment = (String) entity.getProperty("message");
      String user = (String) entity.getProperty("username");
      comments.add(new Comment(user, comment));
    }

    Gson gson = new Gson();
    String json = gson.toJson(comments);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String comment = request.getParameter("text_input");
    String name = request.getParameter("name_input");
    if (comment == null || name == null) {
      response.sendRedirect("/index.html");
      return;  
    }

    Entity commentEntity = new Entity("Comment"); 
    commentEntity.setProperty("message", comment);
    commentEntity.setProperty("username", name);   

    datastore.put(commentEntity); 
    response.sendRedirect("/index.html");
  }
}
