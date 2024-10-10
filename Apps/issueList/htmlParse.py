from html.parser import HTMLParser


class TDHTMLParser(HTMLParser):
    
    def __init__(self):
        super().__init__()
        self.dataInit()

    def dataInit(self):
        self.Content = ""
        self.styleDic = {}
        self.fontColor = None
        self.bgColor = None
        self.isTdStyle = False
        
    def generateResult(self):
        resDic = {'Content' : self.Content}
        if self.bgColor:
            self.styleDic['bg_color'] = self.bgColor
        if self.fontColor:
            self.styleDic['fontstyle'] = self.fontColor
        if self.styleDic:
            resDic['Style'] = self.styleDic
        self.dataInit()
        return resDic
        
    def handle_starttag(self, tag, attrs):
        if 'td' == tag:
            self.isTdStyle = True
            for aSigleAttr in attrs:
                if 'style' == aSigleAttr[0]:
                    styleContent = aSigleAttr[1]
                    bgColorIndex = styleContent.find('#')
                    if bgColorIndex > -1:
                        self.bgColor = styleContent[bgColorIndex : bgColorIndex + 7]
                        
        if 'font' == tag:
            for aSigleAttr in attrs:
                if 'color' == aSigleAttr[0]:
                    styleContent = aSigleAttr[1]
                    bgColorIndex = styleContent.find('#')
                    if bgColorIndex > -1:
                       self.fontColor = styleContent[bgColorIndex : bgColorIndex + 7]
        if 'br' == tag:
            self.Content += '\n'

    def handle_endtag(self, tag):
        print('</%s>' % tag)

    def handle_startendtag(self, tag, attrs):
        print('<%s/>' % tag)

    def handle_data(self, data):
        if self.fontColor:
            fontStyle = self.styleDic.setdefault('fontstyle', [])
            fontStyle.append({'color': self.fontColor, 'staIndex': len(self.Content),'lenth': len(data)})
            self.fontColor = None
        self.Content += data
        

    def handle_comment(self, data):
        print('<!--', data, '-->')

    def handle_entityref(self, name):
        print('&%s;' % name)

    def handle_charref(self, name):
        print('&#%s;' % name)

if '__main__' == __name__:
    tdHtml = r'<td style ="background: #008000">Command "pmuadc --read all --avg 4" return error at CG-INSTALL/QT0 <br><font color="#0000ff">-issue is fixed in diags 33C123</font></td>'
    tdHtml2 = r'<td style="background: #008000">Keep Monitor</td>'
    parser = TDHTMLParser()
    parser.feed(tdHtml)
    print(parser.generateResult())
    
    parser.feed(tdHtml2)
    print(parser.generateResult())