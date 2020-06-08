package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.ArrayList;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Returns covid data as a JSON object, e.g. {"2017": 52, "2018": 34}] */
@WebServlet("/covid-data")
public class CovidDataServlet extends HttpServlet {
  
  ArrayList<DateEntry> covidData = new ArrayList();
  
  private final class DateEntry {
    private String date;
    private LinkedHashMap<String, Integer> cases = new LinkedHashMap();

    public DateEntry(String date) {
      this.date = date;
      this.cases = cases;
    }
    public void addEntry(String state, Integer cases) {
      this.cases.put(state, cases);
    }
  }

  @Override
  public void init() {
    Scanner scanner = new Scanner(getServletContext().getResourceAsStream(
        "/WEB-INF/us-states.csv"));
    String currDate = "";
    DateEntry temp = null; 

    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      String[] cells = line.split(",");
        
      // create new date entry if data changed 
      if (!currDate.equals(cells[0])) {
        // put old entry into arr
        if (temp != null) {
          covidData.add(temp);
        }
        temp = new DateEntry(cells[0]);
        temp.addEntry(cells[1], Integer.valueOf(cells[3]));
        currDate = cells[0];
      } else {
        temp.addEntry(cells[1], Integer.valueOf(cells[3]));
      }
    }
    scanner.close();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(covidData);
    response.getWriter().println(json);
  }

}