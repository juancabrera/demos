#!/usr/bin/ruby1.8
# Script to watch a directory for any changes to a haml file
# and compile it.
#
# USAGE: ruby haml_watch.rb <directory_to_watch>
#
# Original by Blake Smith / http://blakesmith.github.com/2010/09/05/haml-directory-watcher.html
# Modifications by fin / http://fin.io
#
 
require 'rubygems'
require 'fssm'
require 'haml'
 
directory = ARGV.first
FSSM.monitor(directory, '**/*.haml') do
  update do |base, relative|
    input = open("#{base}/#{relative}").read
    output = open("../html/#{relative.gsub!('.haml', '.html')}", 'w');
    output.write(Haml::Engine.new(input).render)
    output.close
    puts "Regenerated #{input} to #{output}"
  end
end