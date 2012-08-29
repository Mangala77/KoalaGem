App = {
  locale: "en",
  current_map_type: "google",
  current_map: {
    default_type: function(){
      switch(App.current_map_type) {
        case "google":
          return App.google_map.default_map_type
          break
        case "bing":
          return App.bing_map.default_map_type
          break  
      }
    },
    map_types: function(){
       switch(App.current_map_type) {
        case "google":
          return App.google_map.map_types
          break
        case "bing":
          return App.bing_map.map_types
          break  
      }        
    }
  },
  google_map: {
    map_types: ["google.maps.MapTypeId.ROADMAP", "google.maps.MapTypeId.SATELLITE",
               "google.maps.MapTypeId.TERRAIN", "google.maps.MapTypeId.HYBRID"],
    default_map_type: "google.maps.MapTypeId.ROADMAP",
    default_type: function(type){
      switch(type) {
        case "satellite":
          App.google_map.default_map_type = "google.maps.MapTypeId.SATELLITE"
          break
        case "roadmap":
          App.google_map.default_map_type = "google.maps.MapTypeId.ROADMAP"
          break
        case "hybrid":
          App.google_map.default_map_type = "google.maps.MapTypeId.HYBRID"
          break
        case "terrain":
          App.google_map.default_map_type = "google.maps.MapTypeId.TERRAIN"
          break
      }
    }
  },
  bing_map: {
    map_types: ["VEMapStyle.Road", "VEMapStyle.Aerial"],
    default_map_type: "VEMapStyle.Road",
    default_type: function(type){
      switch(type) {
        case "Road":
          App.bing_map.default_map_type = "VEMapStyle.Road"
          break
        case "Aerial":
          App.bing_map.default_map_type = "VEMapStyle.Aerial"
          break
      }
    }
  },
  translations: {
    en: {
      view: {
        areYouSure: 'Are you sure?',
        noImages: 'First you should select some submissions with images on current page',
        selectCriteria: 'Select criteria',
        selectFields: 'Select fields',
        noFields: 'There are no submissions to search. Please upload some to involve in smart search.',
        noSubmissions: "No submissions to export",
        hint: "Type in a search term",
        noResults: "No results",
        searching: "Searching...",
        low: "Low",
        normal: "Normal",
        high: "High",
        print: "First you should select some submissions"
      },
      maps: {
        roadmap: "Roadmap",
        road: "Roadmap",
        satellite: "Satellite",
        terrain: "Terrain",
        aerial: "Aerial",
        hybrid: "Hybrid"      
      },
      errors: {
        durationFormat: "Should have hh:mm or h:m format"        
      },
      durationPicker: {
        title: "Choose duration"
      }
    },
    fr: {
      view: {
        areYouSure: 'Etes-vous sûr?',
        noImages: 'Veuillez sélectionner des fiches reçues avec images sur la page courante.',
        selectCriteria: "Sélection des critères",
        selectFields: "Sélection des champs",
        noFields: 'Aucunes fiches pour cette recherche. Veuillez faire des envois pour les intégrer dans smart search.',
        noSubmissions: "Pas de fiches à l'exportation",
        hint: "Taper pour rechercher",
        noResults: "Aucun résultat",
        searching: "En cours de recherche...",
        low: "Basse",
        normal: "Moyenne",
        high: "Haute",
        print: "Veuillez sélectionner des fiches reçues."
      },
      maps: {
        roadmap: "Plan",
        satellite: "Satellite",
        road: "Plan",
        terrain: "Relief",
        aerial: "Aérien",
        hybrid: "Hybride"
      },
      errors: {
        durationFormat: "L’heure doit être au format hh:mm ou h:m"        
      },
      durationPicker: {
        title: "Choix de durée"
      }
    }
  },
  translate: function(string_to_translate){
                  var str    = "App.translations."+App.locale+"."+string_to_translate
                  var to_obj = JSON.stringify(str);
                  var parsed_obj = JSON.parse(to_obj)
                  return eval(parsed_obj);
             }
}   
