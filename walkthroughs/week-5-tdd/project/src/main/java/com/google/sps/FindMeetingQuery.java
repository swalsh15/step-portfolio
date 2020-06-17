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

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;
import java.util.Comparator;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    Collection<String> mandatoryMembers = new ArrayList();
    Collection<String> optionalMembers = new ArrayList();

    // if meeting only has optional members treat them as mandatory
    if (request.getAttendees().isEmpty()) {
      mandatoryMembers = request.getOptionalAttendees();
    } else {
      mandatoryMembers = request.getAttendees();
      optionalMembers = request.getOptionalAttendees(); 
    }

    // go through all events and find unavailable times
    ArrayList<TimeRange> unavailableTimes = findUnavailableTimesMandatoryAttendees(events, mandatoryMembers);   

    // find available times from unavilable times from mandatory members
    ArrayList<TimeRange> availableTimes = findAvailableTimesMandatoryMembers(unavailableTimes, request);
    
    // handle optional members if present
    if (optionalMembers.isEmpty()) {
      return availableTimes;
    }
    
    // add times where mandatory and optional members not busy  
    ArrayList<TimeRange> unavailableTimesOptionalMembers = findUnavailableTimesOptionalAttendees(events, optionalMembers); 
    ArrayList<TimeRange> optionalMemberTimes = findTimeWithOptionalMembers(availableTimes, unavailableTimesOptionalMembers);

    // if no times work for optional members return all times for mandatory members
    if (optionalMemberTimes.isEmpty()) {
      return availableTimes;
    } else {
      return optionalMemberTimes;
    }
  }

  // finds unavailable times for list of mandatory attendees 
  public ArrayList<TimeRange> findUnavailableTimesMandatoryAttendees(Collection<Event> events, Collection<String> mandatoryMembers) {
    ArrayList<TimeRange> unavailableTimes = new ArrayList();
    for (Event e : events) {
      Set<String> attendes = e.getAttendees();
      for (String s : mandatoryMembers) {
        if (attendes.contains(s)) {
          // someone unavailable at time period
          unavailableTimes.add(e.getWhen());
          break;
        }
      }
    }
    return unavailableTimes; 
  }

  // finds unavailable times for list of optional attendees
  public ArrayList<TimeRange> findUnavailableTimesOptionalAttendees(Collection<Event> events, Collection<String> optionalMembers) {
    ArrayList<TimeRange> unavailableTimes = new ArrayList();
    for (Event e : events) {
      Set<String> attendes = e.getAttendees();
      for (String s : optionalMembers) {
        if (attendes.contains(s)) {
          // someone is unavailable at time period
          unavailableTimes.add(e.getWhen());
          break;
        }
      }
    }
    return unavailableTimes; 
  }

  // find times where all mandatory members are free
  public ArrayList<TimeRange> findAvailableTimesMandatoryMembers(ArrayList<TimeRange> unavailableTimes, MeetingRequest request) {
    ArrayList<TimeRange> availableTimes = new ArrayList(); 
    // stores starting time of available time range
    int prevMeetingEnd = 0; 
    // end of latest time period looked at 
    int currMettingEnd = 0;

    Collections.sort(unavailableTimes, TimeRange.ORDER_BY_START);
    for (TimeRange unavailableTimeRange : unavailableTimes) {
      // checks if meeting nested in other - ignore meeting in this case
      if (unavailableTimeRange.end() > currMettingEnd) {
        currMettingEnd = unavailableTimeRange.end();
      } else {
        continue;
      }

      // check time period long enough for meeting
      if (unavailableTimeRange.start() - prevMeetingEnd < request.getDuration()) {
        prevMeetingEnd = unavailableTimeRange.end(); 
        continue; 
      }

      // add avaliable time
      availableTimes.add(TimeRange.fromStartEnd(prevMeetingEnd, unavailableTimeRange.start(), false));
      prevMeetingEnd = unavailableTimeRange.end();     
    }

    // add from start - end check
    if (TimeRange.END_OF_DAY - prevMeetingEnd > request.getDuration()) {
      availableTimes.add(TimeRange.fromStartEnd(prevMeetingEnd, TimeRange.END_OF_DAY, true));
    } 
    return availableTimes; 
  }
 
  // find times when all optional members are free
  public ArrayList<TimeRange> findTimeWithOptionalMembers(ArrayList<TimeRange> availableTimes, ArrayList<TimeRange> unavailableTimesOptionalMembers) {
    ArrayList<TimeRange> optionalMemberTimes = new ArrayList(); 
    for (TimeRange availableTime : availableTimes) {
      for (TimeRange unavailableOptionalTime : unavailableTimesOptionalMembers) {
        if (!availableTime.overlaps(unavailableOptionalTime)) {
          optionalMemberTimes.add(availableTime);
        }
      }
    }
    return optionalMemberTimes; 
  }
}
