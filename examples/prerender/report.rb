#
# Compliments of @igrigorik
# @see: https://gist.github.com/igrigorik/a491cc732b5d4627e193
#

require 'garb'
require 'pp'

#
# $ gem install garb
# $ ruby report.rb login@gmail.com pass UA-XXXXX-X
#

user, pass, property = ARGV

class TopPages
  extend Garb::Model
  metrics :pageviews, :visits, :exitrate
  dimensions :page_path
end

class Destinations
  extend Garb::Model
  metrics :pageviews
  dimensions :page_path
end

Garb::Session.login(user, pass)
profile = Garb::Management::Profile.all.detect {|p| p.web_property_id == property}

top = TopPages.results(profile, :limit => 10, :sort => :pageviews.desc)
top.each do |page|
  destinations = Destinations.results(profile, {
    :filters => {:previouspagepath.eql => page.page_path},
    :limit => 100, :sort => :pageviews.desc
  }).reject {|d| d.page_path == page.page_path }

  total = destinations.reduce(0) {|t,v| t+=v.pageviews.to_i}

  puts
  puts sprintf("Pageviews: %d, Exit rate: %.2f%%, Clickthroughs: %d, **Path: %s**\n\n",
    page.pageviews, page.exit_rate.to_f, total, page.page_path)

  destinations.first(10).each do |dest|
    prob = (dest.pageviews.to_f / page.pageviews.to_f) * 100
    puts sprintf("%10.2f%% - %3s pv : %s", prob, dest.pageviews, dest.page_path)
  end
end
