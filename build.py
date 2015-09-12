import re
import os

'''
Turns a path into a unique variable name
'''
def PathToVar(path):
	dirPath, filePath = os.path.split(path)
	pieces = [filePath.replace('.', '_')]
	while dirPath != '':
		head, tail = os.path.split(dirPath)
		pieces.insert(0, tail)
		dirPath = head
	return '_'.join(pieces)

'''
Makes the environment variables for the preprocessor
'''
def GetEnvironmentVariables():
	env = {}
	env['resources'] = {}
	env['sources'] = []
	
	root = os.path.abspath('.')
	res = os.path.abspath('res')
	src = os.path.abspath('src')
	
	for subdir, dirs, files in os.walk(res):
		for fileName in files:
			if fileName != 'loading.js':
				abspath = os.path.join(os.path.relpath(subdir, root), fileName)
				if subdir == res:
					respath = fileName
				else:
					respath = os.path.join(os.path.relpath(subdir, res), fileName)
				env['resources'][PathToVar(respath)] = abspath
	
	for subdir, dirs, files in os.walk(src):
		for fileName in files:
			if fileName.find('.template') == -1:
				env['sources'].append(os.path.join(os.path.relpath(subdir, root), fileName))
	
	return env

'''
Processes a .template.* file into a .* file
	/*# dict var indent */
		Paste the key/value pairs of the variable with the given name at the given indent
	/*# list var indent */
		Paste the entries of the variable with the given name at the given indent
'''
def Preprocess(path, env):
	with open(path, 'r') as content_file:
		content = content_file.read()
	
	while True:
		match = re.search(r'/\*#(.*)\*/', content)
		if match == None:
			break
		
		replace = ''
		
		pieces = match.group(1).strip().split(' ')
		if pieces[0] == 'dict':
			indent = int(pieces[2])
			lines = []
			for key, value in env[pieces[1]].iteritems():
				lines.append('\t' * indent + key + ': "' + value + '"')
			replace = ',\n'.join(lines)
		elif pieces[0] == 'list':
			indent = int(pieces[2])
			lines = []
			for value in env[pieces[1]]:
				lines.append('\t' * indent + '"' + value + '"')
			replace = ',\n'.join(lines)
		else:
			print('Unrecognized preprocessor command \'%s\'' % ' '.join(pieces))
		
		content = content[:match.start()] + replace + content[match.end():]
	
	with open(path.replace('.template', ''), 'w') as output_file:
		output_file.write(content)

if __name__ == '__main__':
	env = GetEnvironmentVariables()
	Preprocess(os.path.join('src', 'resource.template.js'), env)
	Preprocess('project.template.json', env)
